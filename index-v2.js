/**
 * Host half of the Netease lyric background.
 *
 * The Host owns every privileged read:
 * - Windows SMTC is polled by one long-lived Windows PowerShell helper.
 * - Netease search + /lyric are fetched and the LRC is parsed here.
 * - The browser half reads only this service through the plugin's private
 *   HTTP RPC route (`/netease-lyrics`), never the system media API.
 */

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { appendFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'netease-lyrics-background'
export const inject = ['webServer']

const HERE = dirname(fileURLToPath(import.meta.url))
const SMTC_SCRIPT = join(HERE, 'smtc.ps1')
const DIAG_FILE = join(HERE, 'diag.jsonl')
const DIAG_FLAG = join(HERE, 'diag.enabled')
const RPC_PATH = '/netease-lyrics'
const MAX_BODY = 8 * 1024 * 1024

const NORMAL_OPACITY = 0.08
const DEGRADED_OPACITY = 0.03
const NO_PLAY_MS = 3 * 60 * 1000
const REQUEST_TIMEOUT_MS = 2000
const SEARCH_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
  referer: 'https://music.163.com/',
  accept: 'application/json,text/plain,*/*',
}

function text(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim()
}

function compact(value) {
  return text(value)
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\s\u3000]+/g, '')
    .replace(/[《》「」『』]/g, '')
}

function baseTitle(value) {
  return compact(value)
    .replace(/[（(][^）)]*[）)]/g, '')
    .replace(/\s*[-–—]\s*(live|remaster(ed)?|版|伴奏|纯音乐).*$/i, '')
}

function splitTrack(rawTitle, rawArtist) {
  let title = text(rawTitle)
  let artist = text(rawArtist)
  title = title.replace(/\s*[-–—]\s*(网易云音乐|netease cloudmusic).*$/i, '').trim()
  if (!artist) {
    const match = title.match(/^(.*\S)\s+[-–—]\s+(\S.*)$/)
    if (match) {
      title = text(match[1])
      artist = text(match[2])
    }
  }
  return { title, artist }
}

function scoreSong(song, targetTitle, targetArtist, targetDuration) {
  if (!song || typeof song.name !== 'string') return null
  const songTitle = compact(song.name)
  const title = compact(targetTitle)
  const bareTitle = baseTitle(song.name)
  const artists = Array.isArray(song.artists)
    ? song.artists.map((person) => compact(person?.name))
    : Array.isArray(song.ar)
      ? song.ar.map((person) => compact(person?.name))
      : []
  let score = 0
  if (songTitle === title) score += 14
  else if (bareTitle === compact(targetTitle)) score += 9
  else if (songTitle.includes(title) || title.includes(bareTitle)) score += 4
  else return null

  if (targetArtist) {
    const wanted = compact(targetArtist)
    if (artists.includes(wanted)) score += 14
    else if (artists.some((artist) => artist.includes(wanted) || wanted.includes(artist))) score += 8
    else if (songTitle.includes(wanted)) score -= 2
    else score -= 8
  }

  const duration = Number(song.duration) || Number(song.dt) || 0
  if (targetDuration > 10_000 && duration > 10_000) {
    const delta = Math.abs(duration - targetDuration)
    if (delta < 2500) score += 3
    else if (delta > 20_000) score -= 3
  }

  if (/(翻唱|cover|伴奏|纯音乐|remix|dj)/i.test(song.name) && !/(翻唱|cover|伴奏|remix|dj)/i.test(targetTitle)) {
    score -= 7
  }
  if (song.status === 0) score -= 1
  return { score, song }
}

function chooseSong(payload, targetTitle, targetArtist, targetDuration) {
  const songs = payload?.result?.songs ?? payload?.songs ?? []
  if (!Array.isArray(songs) || songs.length === 0) return null
  let best = null
  for (const song of songs) {
    const candidate = scoreSong(song, targetTitle, targetArtist, targetDuration)
    if (candidate === null) continue
    if (best === null || candidate.score > best.score) best = candidate
  }
  return best !== null && best.score >= 10 ? best.song : null
}

function metadataLine(value) {
  return /^(作词|作曲|编曲|制作人|制作|混音|母带|录音|吉他|贝斯|鼓|和声|监制|统筹|发行|出品|词|曲|OP|SP)\s*[:：]/i.test(
    value,
  )
}

function parseLrc(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return []
  const offsetMatch = raw.match(/\[offset:\s*(-?\d+)\s*\]/i)
  const offset = offsetMatch ? Number(offsetMatch[1]) : 0
  const lines = []
  for (const row of raw.split(/\r?\n/)) {
    const stamps = [...row.matchAll(/\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g)]
    if (stamps.length === 0) continue
    const lyric = text(row.replace(/\[[^\]]*\]/g, ' '))
    if (lyric === '' || metadataLine(lyric)) continue
    for (const stamp of stamps) {
      const minutes = Number(stamp[1])
      const seconds = Number(stamp[2])
      const fraction = stamp[3] ?? '0'
      const millis = Number(fraction.padEnd(3, '0').slice(0, 3))
      const at = minutes * 60_000 + seconds * 1000 + millis + offset
      if (Number.isFinite(at)) lines.push({ at, lyric })
    }
  }
  lines.sort((left, right) => left.at - right.at)
  return lines
}

async function fetchJson(url, signal) {
  const controller = new AbortController()
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  const timeout = setTimeout(abort, REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, {
      headers: SEARCH_HEADERS,
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', abort)
  }
}

class LyricsBridge {
  constructor(ctx) {
    this.ctx = ctx
    this.child = null
    this.stopping = false
    this.restartTimer = null
    this.stdoutRemainder = ''
    this.stderrBytes = 0
    this.loggedFailure = false
    this.media = null
    this.track = null
    this.trackKey = ''
    this.trackSeq = 0
    this.clockBaseMs = 0
    this.clockBaseAt = Date.now()
    this.wasPlaying = false
    this.lastPlayedAt = Date.now()
    this.lyricStatus = 'idle'
    this.lines = []
    this.shownLine = null
    this.songId = null
    this.trackSongs = new Map()
    this.lrcCache = new Map()
    this.fetchController = null
    this.diagCheckedAt = 0
    this.diagOn = false
    this.lastPollAt = Date.now()
  }

  start() {
    this.stopping = false
    this.startHelper()
  }

  stop() {
    this.stopping = true
    this.fetchController?.abort()
    this.fetchController = null
    if (this.restartTimer !== null) {
      clearTimeout(this.restartTimer)
      this.restartTimer = null
    }
    if (this.child !== null) {
      const child = this.child
      this.child = null
      try {
        child.kill()
      } catch {
        // The helper is already gone.
      }
    }
  }

  startHelper() {
    if (this.stopping || this.child !== null) return
    let child
    try {
      child = spawn(
        'powershell.exe',
        ['-NoLogo', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', SMTC_SCRIPT],
        { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] },
      )
    } catch {
      this.noteHelperFailure()
      this.scheduleRestart()
      return
    }
    this.child = child
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk) => this.consume(chunk))
    child.stderr.on('data', (chunk) => {
      this.stderrBytes += Buffer.byteLength(chunk)
    })
    child.on('error', () => {
      this.noteHelperFailure()
    })
    child.on('exit', () => {
      if (this.child === child) this.child = null
      this.stdoutRemainder = ''
      if (!this.stopping) this.scheduleRestart()
    })
  }

  scheduleRestart() {
    if (this.stopping || this.restartTimer !== null) return
    this.restartTimer = setTimeout(() => {
      this.restartTimer = null
      this.startHelper()
    }, 3000)
  }

  noteHelperFailure() {
    if (this.loggedFailure) return
    this.loggedFailure = true
    try {
      this.ctx.logger('netease-lyrics').info('SMTC helper is unavailable; waiting for Windows media')
    } catch {
      // Logging is best-effort.
    }
  }

  consume(chunk) {
    this.stdoutRemainder += chunk
    let newline = this.stdoutRemainder.indexOf('\n')
    while (newline !== -1) {
      const line = this.stdoutRemainder.slice(0, newline).trim()
      this.stdoutRemainder = this.stdoutRemainder.slice(newline + 1)
      if (line.startsWith('{')) this.consumeSample(line)
      newline = this.stdoutRemainder.indexOf('\n')
    }
    if (this.stdoutRemainder.length > 64_000) this.stdoutRemainder = ''
  }

  consumeSample(line) {
    let sample
    try {
      sample = JSON.parse(line)
    } catch {
      return
    }
    const now = Date.now()
    if (sample?.ok !== true) return
    if (sample.session !== true) {
      this.media = { status: 'Closed', positionMs: 0, endMs: 0, at: now }
      this.wasPlaying = false
      return
    }
    const rawStatus = text(sample.status)
    const playing = rawStatus === 'Playing'
    const { title, artist } = splitTrack(sample.title, sample.artist)
    const nextKey = `${title}\u0000${artist}`
    const trackChanged = nextKey !== this.trackKey
    const previousPlaying = this.wasPlaying
    this.media = {
      status: rawStatus || 'Closed',
      title,
      artist,
      appId: text(sample.appId),
      positionMs: Number(sample.positionMs) || 0,
      endMs: Number(sample.endMs) || 0,
      at: now,
    }
    if (playing) this.lastPlayedAt = now

    if (title !== '' && (trackChanged || this.track === null)) {
      this.trackSeq += 1
      this.trackKey = nextKey
      this.track = { title, artist, songId: null, seq: this.trackSeq }
      this.songId = null
      this.lines = []
      this.shownLine = null
      this.lyricStatus = 'loading'
      this.clockBaseMs =
        Number.isFinite(this.media.positionMs) && this.media.positionMs > 0 ? this.media.positionMs : 0
      this.clockBaseAt = now
      this.fetchController?.abort()
      this.fetchController = null
      const cachedSongId = this.trackSongs.get(nextKey)
      if (cachedSongId !== undefined && this.lrcCache.has(cachedSongId)) {
        const cached = this.lrcCache.get(cachedSongId)
        this.applyLyrics(cached.lines, cachedSongId)
      } else {
        void this.fetchLyrics(this.track, this.trackSeq)
      }
    }

    if (!playing) {
      this.wasPlaying = false
      if (previousPlaying) {
        this.clockBaseMs = this.positionAt(now)
        this.clockBaseAt = now
      }
      if (this.media.positionMs > 0 && Math.abs(this.media.positionMs - this.positionAt(now)) > 2500) {
        this.clockBaseMs = this.media.positionMs
        this.clockBaseAt = now
      }
    } else {
      if (!previousPlaying) {
        this.clockBaseAt = now
        this.clockBaseMs = Math.max(0, this.clockBaseMs)
      }
      const current = this.clockBaseMs + (now - this.clockBaseAt)
      if (this.media.positionMs > 0 && Math.abs(this.media.positionMs - current) > 2500) {
        this.clockBaseMs = this.media.positionMs
        this.clockBaseAt = now
      }
      this.wasPlaying = true
    }
  }

  positionAt(now = Date.now()) {
    if (!this.wasPlaying) return Math.max(0, this.clockBaseMs)
    return Math.max(0, this.clockBaseMs + (now - this.clockBaseAt))
  }

  async fetchLyrics(track, seq) {
    const controller = new AbortController()
    this.fetchController = controller
    try {
      const query = encodeURIComponent(`${track.title} ${track.artist}`.trim())
      const searchUrl =
        `https://music.163.com/api/search/get/web?csrf_token=&s=${query}` +
        `&type=1&offset=0&total=true&limit=30`
      let payload
      try {
        payload = await fetchJson(searchUrl, controller.signal)
      } catch {
        const fallbackUrl =
          `https://music.163.com/api/search/get?s=${query}&type=1&offset=0&limit=30`
        payload = await fetchJson(fallbackUrl, controller.signal)
      }
      if (seq !== this.trackSeq) return
      const song = chooseSong(payload, track.title, track.artist, this.media?.endMs ?? 0)
      if (!song || !Number.isFinite(Number(song.id))) {
        this.markLyricsUnavailable(seq)
        return
      }
      const songId = Number(song.id)
      const cached = this.lrcCache.get(songId)
      if (cached !== undefined) {
        this.trackSongs.set(this.trackKey, songId)
        this.applyLyrics(cached.lines, songId)
        return
      }
      const lyricUrl = `https://music.163.com/api/song/lyric?id=${songId}&lv=1&kv=1&tv=-1`
      const lyricPayload = await fetchJson(lyricUrl, controller.signal)
      if (seq !== this.trackSeq) return
      const lines = parseLrc(lyricPayload?.lrc?.lyric ?? '')
      this.lrcCache.set(songId, { lines })
      this.trackSongs.set(this.trackKey, songId)
      this.applyLyrics(lines, songId)
    } catch {
      if (seq === this.trackSeq) this.markLyricsUnavailable(seq)
    } finally {
      if (this.fetchController === controller) this.fetchController = null
    }
  }

  applyLyrics(lines, songId) {
    this.songId = songId
    if (this.track !== null) this.track.songId = songId
    this.lines = lines
    if (lines.length === 0) {
      this.lyricStatus = 'degraded'
      return
    }
    this.lyricStatus = 'ok'
    this.shownLine = null
    this.updateLine(Date.now())
  }

  markLyricsUnavailable(seq) {
    if (seq !== this.trackSeq) return
    this.lyricStatus = 'degraded'
  }

  updateLine(now) {
    if (this.lyricStatus !== 'ok' || this.lines.length === 0) return
    const position = this.positionAt(now)
    let index = -1
    for (let i = 0; i < this.lines.length; i += 1) {
      if (this.lines[i].at <= position + 100) index = i
      else break
    }
    if (index < 0) {
      this.shownLine = null
      return
    }
    const line = this.lines[index]
    const key = `${this.songId}:${index}:${line.lyric}`
    if (this.shownLine?.key === key) return
    this.shownLine = {
      key,
      text: line.lyric,
      index,
      at: line.at,
      songId: this.songId,
    }
  }

  isDiagOn() {
    const now = Date.now()
    if (now - this.diagCheckedAt < 1500) return this.diagOn
    this.diagCheckedAt = now
    try {
      this.diagOn = existsSync(DIAG_FLAG)
    } catch {
      this.diagOn = false
    }
    return this.diagOn
  }

  snapshot() {
    const now = Date.now()
    this.lastPollAt = now
    this.updateLine(now)
    const trackActive = this.media !== null && this.media.status !== 'Closed' && this.track !== null
    const playing = this.media?.status === 'Playing'
    const visible = now - this.lastPlayedAt < NO_PLAY_MS
    const degraded = !trackActive || this.lyricStatus !== 'ok'
    return {
      v: 1,
      visible,
      playing,
      active: trackActive,
      status: this.media?.status ?? 'Closed',
      track: this.track === null ? null : {
        title: this.track.title,
        artist: this.track.artist,
        songId: this.songId,
      },
      line: this.shownLine?.text ?? null,
      lineKey: this.shownLine?.key ?? null,
      lineIndex: this.shownLine?.index ?? -1,
      lyricStatus: this.lyricStatus,
      degraded,
      opacity: degraded ? DEGRADED_OPACITY : NORMAL_OPACITY,
      positionMs: Math.round(this.positionAt(now)),
      diag: this.isDiagOn(),
      at: now,
    }
  }

  async recordDiag(payload) {
    if (!this.isDiagOn()) return { ok: false, error: { message: 'diagnostics disabled' } }
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
      return { ok: false, error: { message: 'diagnostic payload must be an object' } }
    }
    const record = { ...payload, receivedAt: Date.now() }
    await appendFile(DIAG_FILE, `${JSON.stringify(record)}\n`, 'utf8')
    return { ok: true, value: { written: true } }
  }
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let total = 0
    request.on('data', (chunk) => {
      total += chunk.length
      if (total > MAX_BODY) {
        reject(new Error('request body too large'))
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    request.on('error', reject)
  })
}

function sendJson(response, status, value) {
  const body = JSON.stringify(value)
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(body),
  })
  response.end(body)
}

export function apply(ctx) {
  const bridge = new LyricsBridge(ctx)
  ctx.provide('neteaseLyrics', bridge)

  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: RPC_PATH,
        handler: async (request, response) => {
          try {
            if (request.method !== 'POST') {
              response.writeHead(405)
              response.end()
              return
            }
            const contentType = (request.headers['content-type'] ?? '').split(';', 1)[0].trim().toLowerCase()
            if (contentType !== 'application/json') {
              response.writeHead(415)
              response.end()
              return
            }
            const url = new URL(request.url ?? '/', 'http://dsh.internal')
            if (!url.pathname.startsWith(`${RPC_PATH}/`)) {
              response.writeHead(404)
              response.end()
              return
            }
            const endpoint = url.pathname.slice(RPC_PATH.length + 1)
            const raw = await readBody(request)
            let envelope
            try {
              envelope = JSON.parse(raw)
            } catch {
              response.writeHead(400)
              response.end()
              return
            }
            if (
              envelope === null ||
              typeof envelope !== 'object' ||
              envelope.type !== 'client-request' ||
              typeof envelope.rpcId !== 'string' ||
              envelope.method !== endpoint
            ) {
              response.writeHead(400)
              response.end()
              return
            }
            let result
            try {
              if (endpoint === 'snapshot') {
                result = { ok: true, value: bridge.snapshot() }
              } else if (endpoint === 'diag') {
                result = await bridge.recordDiag(envelope.payload)
              } else {
                result = { ok: false, error: { code: 'not-found', message: 'unknown lyric endpoint' } }
              }
            } catch (error) {
              result = {
                ok: false,
                error: {
                  code: 'lyrics-internal',
                  message: error instanceof Error ? error.message : String(error),
                },
              }
            }
            sendJson(response, 200, {
              type: 'server-response',
              rpcId: envelope.rpcId,
              result,
            })
          } catch {
            try {
              response.writeHead(500)
              response.end()
            } catch {
              // The client socket is already gone.
            }
          }
        },
      }),
    'netease-lyrics: private RPC route',
  )

  ctx.effect(() => {
    bridge.start()
    return () => bridge.stop()
  }, 'netease-lyrics: SMTC helper')
}
