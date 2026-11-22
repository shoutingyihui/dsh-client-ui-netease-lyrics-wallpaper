window.__ModuleLoader__.load({
  id: '@deepseek-ai/dsh-client-ui-netease-lyrics-wallpaper',
  factory(require) {
    const React = require('react')
    const ReactDOM = require('react-dom')
    const h = React.createElement

    const PLUGIN = '@deepseek-ai/dsh-client-ui-netease-lyrics-wallpaper'
    const RPC_CHANNEL = '/netease-lyrics'
    const POLL_MS = 300
    const CROSSFADE_MS = 500
    const FONT_FAMILY =
      '"PingFang SC","Microsoft YaHei UI","Microsoft YaHei","Noto Sans CJK SC",system-ui,sans-serif'
    const INTERACTIVE_SELECTOR = [
      'button',
      'input',
      'textarea',
      'select',
      'a[href]',
      '[role="button"]',
      '[role="switch"]',
      '[role="tab"]',
      '[role="textbox"]',
      '[contenteditable="true"]',
    ].join(',')

    const CSS = `
      [data-netease-lyrics-layer] {
        position: absolute;
        inset: 0;
        z-index: 5;
        overflow: hidden;
        pointer-events: none;
        user-select: none;
        opacity: 0;
        transition: opacity 800ms cubic-bezier(.33, 0, .2, 1);
        contain: layout paint style;
        --nl-auto-color: color-mix(in srgb, var(--dsw-alias-label-primary, #252525) 82%, var(--dsw-alias-label-secondary, #686868) 18%);
        --nl-color: var(--nl-auto-color);
      }
      body[data-ds-dark-theme] [data-netease-lyrics-layer] {
        --nl-auto-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #b94a51) 58%, var(--dsw-alias-label-secondary, #a6a6a6) 42%);
      }
      [data-netease-lyrics-layer] .nl-line {
        position: absolute;
        left: var(--nl-x, 50%);
        top: var(--nl-y, 64%);
        transform: translate(-50%, -50%);
        white-space: nowrap;
        font-family: ${FONT_FAMILY};
        font-weight: 700;
        line-height: 1;
        letter-spacing: .01em;
        color: var(--nl-color);
        -webkit-font-smoothing: antialiased;
        text-rendering: geometricPrecision;
        will-change: opacity, font-size;
      }
      [data-netease-lyrics-layer] .nl-line[data-phase="in"] {
        animation: nl-lyric-in ${CROSSFADE_MS}ms ease both;
      }
      [data-netease-lyrics-layer] .nl-line[data-phase="out"] {
        animation: nl-lyric-out ${CROSSFADE_MS}ms ease both;
      }
      @keyframes nl-lyric-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes nl-lyric-out {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @media (max-width: 899.98px) {
        [data-netease-lyrics-layer] { display: none !important; }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-netease-lyrics-layer],
        [data-netease-lyrics-layer] .nl-line { transition-duration: 1ms; animation-duration: 1ms; }
      }
    `

    const SETTINGS_CSS = `
      .nl-settings {
        box-sizing: border-box;
        width: 100%;
        max-width: 760px;
        padding: 4px 0 32px;
        color: var(--dsw-alias-label-primary);
        font-family: ${FONT_FAMILY};
      }
      .nl-settings-head { display: flex; flex-direction: column; gap: 4px; padding-bottom: 18px; }
      .nl-settings-head h2 {
        margin: 0;
        color: var(--dsw-alias-label-primary);
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        letter-spacing: -.01em;
      }
      .nl-settings-head p {
        margin: 0;
        color: var(--dsw-alias-label-secondary);
        font-size: 13px;
        line-height: 20px;
      }
      .nl-preview {
        position: relative;
        box-sizing: border-box;
        display: flex;
        min-height: 158px;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 16px;
        background: var(--dsw-alias-bg-base);
      }
      .nl-preview::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(var(--dsw-alias-bg-layer-1) 1px, transparent 1px) 0 54px / 100% 32px,
          linear-gradient(var(--dsw-alias-bg-layer-1) 1px, transparent 1px) 0 0 / 100% 32px;
        opacity: .35;
        pointer-events: none;
      }
      .nl-preview-label {
        position: absolute;
        top: 12px;
        left: 14px;
        z-index: 1;
        color: var(--dsw-alias-label-secondary);
        font-size: 11px;
        line-height: 16px;
        letter-spacing: .02em;
      }
      .nl-preview-word {
        position: relative;
        z-index: 1;
        max-width: calc(100% - 48px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: clamp(24px, 3.2vw, 40px);
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: .01em;
        transition: opacity 160ms ease, color 160ms ease;
      }
      .nl-settings-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 18px 0;
        border-bottom: 1px solid var(--dsw-alias-border-l1);
      }
      .nl-settings-group:last-of-type { border-bottom: 0; }
      .nl-field-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        min-width: 0;
      }
      .nl-field-label {
        color: var(--dsw-alias-label-primary);
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
      }
      .nl-field-value {
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 18px;
        font-variant-numeric: tabular-nums;
      }
      .nl-hint {
        margin: 0;
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 18px;
      }
      .nl-seg {
        display: inline-flex;
        gap: 2px;
        padding: 2px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 10px;
        background: var(--dsw-alias-bg-layer-1);
      }
      .nl-seg button {
        appearance: none;
        border: 0;
        border-radius: 8px;
        padding: 5px 11px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font: inherit;
        font-size: 12px;
        line-height: 18px;
        cursor: pointer;
      }
      .nl-seg button[aria-pressed="true"] {
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary);
        box-shadow: inset 0 0 0 1px var(--dsw-alias-border-l2);
      }
      .nl-seg button:hover:not([aria-pressed="true"]) { color: var(--dsw-alias-label-primary); }
      .nl-color-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .nl-color-input {
        box-sizing: border-box;
        width: 46px;
        height: 34px;
        padding: 3px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 10px;
        background: var(--dsw-alias-bg-layer-1);
        cursor: pointer;
      }
      .nl-hex {
        box-sizing: border-box;
        width: 92px;
        height: 34px;
        padding: 0 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 9px;
        outline: none;
        background: var(--dsw-alias-bg-base);
        color: var(--dsw-alias-label-primary);
        font: inherit;
        font-size: 13px;
        font-variant-numeric: tabular-nums;
      }
      .nl-hex:focus-visible { border-color: var(--dsw-alias-brand-primary); }
      .nl-swatch {
        box-sizing: border-box;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 2px solid transparent;
        border-radius: 999px;
        cursor: pointer;
        box-shadow: inset 0 0 0 1px rgba(127, 127, 127, .22);
      }
      .nl-swatch:hover { border-color: var(--dsw-alias-border-l2); }
      .nl-auto-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 18px;
      }
      .nl-auto-dot {
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 999px;
        border: 1px solid var(--dsw-alias-border-l2);
      }
      .nl-range {
        width: 100%;
        margin: 2px 0 0;
        accent-color: var(--dsw-alias-brand-primary);
        cursor: pointer;
      }
      .nl-range-scale {
        display: flex;
        justify-content: space-between;
        color: var(--dsw-alias-label-secondary);
        font-size: 11px;
        line-height: 16px;
      }
      .nl-contrast-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
      .nl-contrast-number {
        color: var(--dsw-alias-label-primary);
        font-size: 24px;
        font-weight: 600;
        line-height: 30px;
        letter-spacing: -.02em;
        font-variant-numeric: tabular-nums;
      }
      .nl-contrast-badge {
        padding: 1px 8px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 999px;
        color: var(--dsw-alias-label-secondary);
        font-size: 11px;
        line-height: 18px;
      }
      .nl-meter {
        width: 100%;
        height: 6px;
        overflow: hidden;
        border-radius: 999px;
        background: var(--dsw-alias-bg-layer-2);
      }
      .nl-meter span { display: block; height: 100%; border-radius: inherit; background: var(--dsw-alias-brand-primary); }
      .nl-preset-row { display: flex; flex-wrap: wrap; gap: 8px; }
      .nl-preset {
        appearance: none;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 7px 11px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 999px;
        background: transparent;
        color: var(--dsw-alias-label-primary);
        font: inherit;
        font-size: 12px;
        line-height: 18px;
        cursor: pointer;
      }
      .nl-preset:hover { background: var(--dsw-alias-bg-layer-1); border-color: var(--dsw-alias-border-l2); }
      .nl-preset-dot { width: 9px; height: 9px; border-radius: 999px; }
      .nl-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding-top: 18px;
      }
      .nl-status { color: var(--dsw-alias-label-secondary); font-size: 12px; line-height: 18px; }
      .nl-reset {
        appearance: none;
        padding: 6px 10px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 9px;
        background: transparent;
        color: var(--dsw-alias-label-secondary);
        font: inherit;
        font-size: 12px;
        line-height: 18px;
        cursor: pointer;
      }
      .nl-reset:hover { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l2); }
      .nl-settings button:focus-visible,
      .nl-settings input:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 2px; }
      .nl-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        box-sizing: border-box;
        padding: min(9vh, 84px) 16px 24px clamp(16px, 8vw, 120px);
        background: rgba(0, 0, 0, .38);
        pointer-events: auto;
        overflow: auto;
      }
      .nl-modal {
        position: relative;
        box-sizing: border-box;
        width: min(680px, 100%);
        max-height: min(calc(100vh - min(9vh, 84px) - 24px), 640px);
        overflow: auto;
        padding: 24px;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 18px;
        background: var(--dsw-alias-bg-layer-1);
        box-shadow: 0 24px 80px rgba(0, 0, 0, .38);
      }
      .nl-modal-close {
        position: absolute;
        top: 14px;
        right: 14px;
        z-index: 1;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-1);
        color: var(--dsw-alias-label-secondary);
        font: inherit;
        font-size: 16px;
        line-height: 26px;
        cursor: pointer;
      }
      .nl-modal-close:hover { color: var(--dsw-alias-label-primary); border-color: var(--dsw-alias-border-l2); }
      .nl-shortcut {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--dsw-alias-label-secondary);
        font-size: 12px;
        line-height: 18px;
      }
      .nl-shortcut kbd {
        padding: 1px 5px;
        border: 1px solid var(--dsw-alias-border-l1);
        border-radius: 5px;
        background: var(--dsw-alias-bg-layer-1);
        font: inherit;
        font-size: 11px;
      }
      @media (max-width: 560px) {
        .nl-preview { min-height: 132px; }
        .nl-field-row { align-items: flex-start; flex-direction: column; gap: 8px; }
        .nl-footer { align-items: flex-start; flex-direction: column; }
      }
    `

    function selectedView(snapshot) {
      if (!snapshot || typeof snapshot !== 'object') return null
      const track = snapshot.track && typeof snapshot.track === 'object' ? snapshot.track : null
      return {
        visible: snapshot.visible !== false,
        playing: snapshot.playing === true,
        active: snapshot.active === true,
        status: typeof snapshot.status === 'string' ? snapshot.status : 'Closed',
        line: typeof snapshot.line === 'string' && snapshot.line !== '' ? snapshot.line : null,
        lineKey:
          typeof snapshot.lineKey === 'string' && snapshot.lineKey !== '' ? snapshot.lineKey : null,
        lyricStatus: typeof snapshot.lyricStatus === 'string' ? snapshot.lyricStatus : 'idle',
        degraded: snapshot.degraded !== false,
        opacity: Number.isFinite(snapshot.opacity) ? snapshot.opacity : 0.03,
        trackTitle: track && typeof track.title === 'string' ? track.title : '',
        trackArtist: track && typeof track.artist === 'string' ? track.artist : '',
        songId: track && Number.isFinite(track.songId) ? track.songId : null,
        diag: snapshot.diag === true,
      }
    }

    function sameView(left, right) {
      if (left === right) return true
      if (!left || !right) return false
      return (
        left.visible === right.visible &&
        left.playing === right.playing &&
        left.active === right.active &&
        left.status === right.status &&
        left.line === right.line &&
        left.lineKey === right.lineKey &&
        left.lyricStatus === right.lyricStatus &&
        left.degraded === right.degraded &&
        left.opacity === right.opacity &&
        left.trackTitle === right.trackTitle &&
        left.trackArtist === right.trackArtist &&
        left.songId === right.songId &&
        left.diag === right.diag
      )
    }

    const STYLE_STORAGE_KEY = 'dsh.netease-lyrics.style.v1'
    const COLOR_SWATCHES = Object.freeze([
      { label: '珊瑚红', color: '#d47b7f' },
      { label: '暖白', color: '#f1ded1' },
      { label: '薄青', color: '#a8ced0' },
      { label: '雾灰', color: '#b7b7c2' },
    ])
    const QUICK_OPACITIES = Object.freeze([
      { value: 0.08, label: '淡 8%' },
      { value: 0.14, label: '清楚 14%' },
      { value: 0.22, label: '醒目 22%' },
      { value: 0.30, label: '强 30%' },
    ])
    const DEFAULT_STYLE = Object.freeze({
      mode: 'auto',
      color: '#d47b7f',
      opacity: 0.08,
    })
    const MIN_OPACITY = 0.02
    const MAX_OPACITY = 0.35

    function normalizeStyle(input) {
      const source = input && typeof input === 'object' ? input : {}
      const mode = source.mode === 'custom' ? 'custom' : 'auto'
      const color =
        typeof source.color === 'string' && /^#[0-9a-f]{6}$/i.test(source.color)
          ? source.color.toLowerCase()
          : DEFAULT_STYLE.color
      const rawOpacity = Number(source.opacity)
      const opacity = Number.isFinite(rawOpacity)
        ? Math.round(Math.min(MAX_OPACITY, Math.max(MIN_OPACITY, rawOpacity)) * 1000) / 1000
        : DEFAULT_STYLE.opacity
      return { mode, color, opacity }
    }

    function readStoredStyle() {
      try {
        const raw = localStorage.getItem(STYLE_STORAGE_KEY)
        if (raw === null) return { ...DEFAULT_STYLE }
        return normalizeStyle(JSON.parse(raw))
      } catch {
        return { ...DEFAULT_STYLE }
      }
    }

    function createStyleStore() {
      let state = { style: readStoredStyle(), status: 'saved' }
      const listeners = new Set()
      let saveTimer = null
      const emit = () => {
        for (const listener of listeners) listener(state)
      }
      const persist = () => {
        try {
          localStorage.setItem(STYLE_STORAGE_KEY, JSON.stringify(state.style))
          state = { style: state.style, status: 'saved' }
        } catch {
          state = { style: state.style, status: 'error' }
        }
        emit()
      }
      const schedule = () => {
        if (saveTimer !== null) clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          saveTimer = null
          persist()
        }, 120)
      }
      return {
        get() {
          return state
        },
        subscribe(listener) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },
        update(patch) {
          state = {
            style: normalizeStyle({ ...state.style, ...patch }),
            status: 'saving',
          }
          emit()
          schedule()
        },
        reset() {
          state = { style: { ...DEFAULT_STYLE }, status: 'saving' }
          emit()
          schedule()
        },
        dispose() {
          if (saveTimer !== null) {
            clearTimeout(saveTimer)
            saveTimer = null
            persist()
          }
          listeners.clear()
        },
      }
    }

    function useStyleStore(store) {
      const [state, setState] = React.useState(store.get)
      React.useEffect(() => store.subscribe(setState), [store])
      return state
    }

    function autoColorExpression(dark) {
      return dark
        ? 'color-mix(in srgb, var(--dsw-alias-state-error-primary, #b94a51) 58%, var(--dsw-alias-label-secondary, #a6a6a6) 42%)'
        : 'color-mix(in srgb, var(--dsw-alias-label-primary, #252525) 82%, var(--dsw-alias-label-secondary, #686868) 18%)'
    }

    function useDarkTheme() {
      const [dark, setDark] = React.useState(
        () => document.body?.hasAttribute('data-ds-dark-theme') === true,
      )
      React.useEffect(() => {
        if (!document.body) return undefined
        const update = () => setDark(document.body.hasAttribute('data-ds-dark-theme'))
        update()
        const observer = new MutationObserver(update)
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['data-ds-dark-theme'],
        })
        return () => observer.disconnect()
      }, [])
      return dark
    }

    function parseCssColor(value) {
      if (typeof value !== 'string') return null
      const srgb = value.match(
        /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/i,
      )
      if (srgb) {
        return [
          Number(srgb[1]) * 255,
          Number(srgb[2]) * 255,
          Number(srgb[3]) * 255,
        ]
      }
      const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i)
      if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
      return null
    }

    function resolveColor(expression) {
      const probe = document.createElement('span')
      probe.style.color = expression
      probe.style.position = 'absolute'
      probe.style.visibility = 'hidden'
      probe.style.pointerEvents = 'none'
      document.body.appendChild(probe)
      const resolved = getComputedStyle(probe).color
      probe.remove()
      return parseCssColor(resolved)
    }

    function backgroundRgb() {
      const overlay = document.querySelector('[data-shell-overlay]')
      const frame = overlay?.parentElement
      const candidates = [frame, document.body, document.documentElement]
      for (const element of candidates) {
        if (!(element instanceof HTMLElement)) continue
        const color = parseCssColor(getComputedStyle(element).backgroundColor)
        if (color !== null) return color
      }
      return parseCssColor(getComputedStyle(document.body).color) ?? [18, 18, 21]
    }

    function relativeLuminance(rgb) {
      const channels = rgb.map((value) => {
        const normalized = Math.max(0, Math.min(255, value)) / 255
        return normalized <= 0.04045
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
    }

    function useLyricContrast(style, dark) {
      const colorExpression = style.mode === 'custom' ? style.color : autoColorExpression(dark)
      const [ratio, setRatio] = React.useState(null)
      React.useEffect(() => {
        const frame = requestAnimationFrame(() => {
          const lyric = resolveColor(colorExpression)
          const background = backgroundRgb()
          if (lyric === null || background === null) {
            setRatio(null)
            return
          }
          const composited = lyric.map(
            (channel, index) => channel * style.opacity + background[index] * (1 - style.opacity),
          )
          const light = relativeLuminance(composited)
          const darkness = relativeLuminance(background)
          const high = Math.max(light, darkness)
          const low = Math.min(light, darkness)
          setRatio((high + 0.05) / (low + 0.05))
        })
        return () => cancelAnimationFrame(frame)
      }, [colorExpression, style.opacity, dark])
      return { colorExpression, ratio }
    }

    function useHostSnapshot(connection) {
      const [snapshot, setSnapshot] = React.useState(null)
      React.useEffect(() => {
        let disposed = false
        let inFlight = false
        let controller = null
        const tick = async () => {
          if (disposed || inFlight) return
          inFlight = true
          controller = new AbortController()
          try {
            const result = await connection.rpc.call(RPC_CHANNEL, 'snapshot', {}, controller.signal)
            if (disposed || !result || result.ok !== true) return
            const next = selectedView(result.value)
            setSnapshot((previous) => (sameView(previous, next) ? previous : next))
          } catch {
            // The host or page may be unmounting. Keep the last painted state.
          } finally {
            inFlight = false
            controller = null
          }
        }
        const timer = setInterval(tick, POLL_MS)
        void tick()
        return () => {
          disposed = true
          clearInterval(timer)
          controller?.abort()
        }
      }, [connection])
      return snapshot
    }

    function useCrossfade(snapshot) {
      const [display, setDisplay] = React.useState({ current: null, previous: null })
      const currentRef = React.useRef(null)
      const timerRef = React.useRef(null)
      React.useEffect(() => {
        const incoming =
          snapshot?.line && snapshot?.lineKey
            ? { text: snapshot.line, key: snapshot.lineKey }
            : null
        if (incoming?.key === currentRef.current?.key && incoming?.text === currentRef.current?.text) {
          return undefined
        }
        const outgoing = currentRef.current
        currentRef.current = incoming
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        setDisplay({
          current: incoming,
          previous: outgoing && outgoing.key !== incoming?.key ? outgoing : null,
        })
        if (incoming !== null) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null
            setDisplay((value) => ({ current: value.current, previous: null }))
          }, CROSSFADE_MS + 30)
        }
        return undefined
      }, [snapshot?.lineKey, snapshot?.line])
      React.useEffect(
        () => () => {
          if (timerRef.current !== null) clearTimeout(timerRef.current)
        },
        [],
      )
      return display
    }

    function findCenterColumn(frame) {
      const frameRect = frame.getBoundingClientRect()
      let best = null
      let bestDistance = Infinity
      for (const child of frame.children) {
        if (!(child instanceof HTMLElement)) continue
        if (child.hasAttribute('data-shell-overlay')) continue
        if (child.hasAttribute('data-netease-lyrics-layer')) continue
        if (child.hasAttribute('data-side')) continue
        const rect = child.getBoundingClientRect()
        if (rect.width <= 80 || rect.height <= 0) continue
        const distance = Math.abs(rect.left + rect.width / 2 - (frameRect.left + frameRect.width / 2))
        if (distance < bestDistance) {
          bestDistance = distance
          best = child
        }
      }
      return best
    }

    function useLayerLayout(hostNode) {
      const [layout, setLayout] = React.useState({
        x: '50%',
        y: '64%',
        maxWidth: 600,
        baseFont: 96,
        centerWidth: 0,
      })
      React.useEffect(() => {
        const frame = hostNode?.parentElement
        if (!frame) return undefined
        let raf = null
        let observer = null
        let fontTimer = null
        const measure = () => {
          const frameRect = frame.getBoundingClientRect()
          if (frameRect.width <= 0 || frameRect.height <= 0) return
          const center = findCenterColumn(frame)
          const centerRect = center?.getBoundingClientRect() ?? null
          const usable =
            centerRect !== null && centerRect.width > 80
              ? centerRect.width
              : Math.min(frameRect.width, 960)
          const maxWidth = Math.max(120, usable - 96)
          const baseFont = Math.max(24, window.innerWidth * 0.08)
          const x = centerRect !== null && centerRect.width > 80
            ? `${centerRect.left - frameRect.left + centerRect.width / 2}px`
            : '50%'
          const y = `${Math.round(frameRect.height * 0.64)}px`
          setLayout({ x, y, maxWidth, baseFont, centerWidth: usable })
        }
        const schedule = () => {
          if (raf !== null) return
          raf = requestAnimationFrame(() => {
            raf = null
            measure()
          })
        }
        measure()
        observer = new ResizeObserver(schedule)
        observer.observe(frame)
        const center = findCenterColumn(frame)
        if (center) observer.observe(center)
        const onResize = () => schedule()
        window.addEventListener('resize', onResize)
        if (document.fonts?.ready) {
          document.fonts.ready.then(() => {
            fontTimer = setTimeout(measure, 0)
          })
        }
        return () => {
          observer?.disconnect()
          window.removeEventListener('resize', onResize)
          if (raf !== null) cancelAnimationFrame(raf)
          if (fontTimer !== null) clearTimeout(fontTimer)
        }
      }, [hostNode])
      return layout
    }

    function fitFont(text, baseFont, maxWidth) {
      if (!text) return Math.max(8, baseFont)
      try {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return baseFont
        context.font = `700 ${baseFont}px ${FONT_FAMILY}`
        const width = context.measureText(text).width
        if (!Number.isFinite(width) || width <= 0 || width <= maxWidth) return baseFont
        return Math.max(8, Math.floor(baseFont * (maxWidth / width) * 100) / 100)
      } catch {
        return baseFont
      }
    }

    const diagState = {
      installed: false,
      errors: [],
      restore: null,
      lastSignature: '',
      timer: null,
    }

    function shortError(value) {
      if (value instanceof Error) return `${value.name}: ${value.message}`
      if (typeof value === 'string') return value
      try {
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }

    function installErrorCapture() {
      if (diagState.installed || typeof window === 'undefined') return
      diagState.installed = true
      const originalError = console.error
      const onError = (event) => {
        diagState.errors.push(`window.error: ${shortError(event.error ?? event.message)}`)
        diagState.errors = diagState.errors.slice(-20)
      }
      const onRejection = (event) => {
        diagState.errors.push(`unhandledrejection: ${shortError(event.reason)}`)
        diagState.errors = diagState.errors.slice(-20)
      }
      console.error = function (...args) {
        diagState.errors.push(`console.error: ${args.map(shortError).join(' ')}`)
        diagState.errors = diagState.errors.slice(-20)
        return originalError.apply(this, args)
      }
      window.addEventListener('error', onError)
      window.addEventListener('unhandledrejection', onRejection)
      diagState.restore = () => {
        console.error = originalError
        window.removeEventListener('error', onError)
        window.removeEventListener('unhandledrejection', onRejection)
        diagState.installed = false
        diagState.restore = null
      }
    }

    function elementKey(element, index) {
      const label =
        element.getAttribute('aria-label') ||
        element.getAttribute('placeholder') ||
        element.getAttribute('title') ||
        ''
      const content = (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48)
      return `${element.tagName.toLowerCase()}|${label}|${content}|${index}`
    }

    function rectOf(element) {
      const rect = element.getBoundingClientRect()
      return {
        x: Math.round(rect.x * 1000) / 1000,
        y: Math.round(rect.y * 1000) / 1000,
        width: Math.round(rect.width * 1000) / 1000,
        height: Math.round(rect.height * 1000) / 1000,
      }
    }

    function collectInteractive() {
      const nodes = [...document.querySelectorAll(INTERACTIVE_SELECTOR)]
      const result = []
      const seen = new Set()
      for (const element of nodes) {
        if (!(element instanceof HTMLElement)) continue
        if (element.closest('[data-netease-lyrics-layer]')) continue
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        if (style.display === 'none' || style.visibility === 'hidden') continue
        if (Number(style.opacity) === 0) continue
        if (rect.width <= 0 || rect.height <= 0) continue
        if (rect.bottom <= 0 || rect.right <= 0 || rect.top >= window.innerHeight || rect.left >= window.innerWidth) {
          continue
        }
        const key = elementKey(element, result.length)
        if (seen.has(key)) continue
        seen.add(key)
        result.push({ key, tag: element.tagName.toLowerCase(), rect: rectOf(element), element })
      }
      return result
    }

    function sampleHitTesting(controls) {
      const hits = []
      for (const control of controls) {
        const { element, rect } = control
        const x = rect.x + rect.width / 2
        const y = rect.y + rect.height / 2
        const hit = document.elementFromPoint(x, y)
        const passed = hit !== null && (hit === element || element.contains(hit))
        hits.push({
          key: control.key,
          passed,
          hit: hit === null ? 'null' : hit.tagName.toLowerCase(),
        })
      }
      return hits
    }

    function sampleInputFocus(controls) {
      const previous = document.activeElement
      const values = []
      for (const control of controls) {
        const element = control.element
        if (!(element instanceof HTMLElement)) continue
        if (
          element.tagName === 'INPUT' ||
          element.tagName === 'TEXTAREA' ||
          element.getAttribute('contenteditable') === 'true'
        ) {
          try {
            element.focus({ preventScroll: true })
            values.push({
              key: control.key,
              focusable: document.activeElement === element,
            })
          } catch {
            values.push({ key: control.key, focusable: false })
          }
        }
      }
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true })
      return values
    }

    function layerRecord(hostNode) {
      if (!hostNode) return null
      const layer = hostNode.querySelector('[data-netease-lyrics-layer]') ?? hostNode
      const line = layer.querySelector('.nl-line[data-phase="in"]') ?? layer.querySelector('.nl-line')
      const style = getComputedStyle(layer)
      const rect = layer.getBoundingClientRect()
      const focusable = layer.querySelectorAll(
        'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
      )
      return {
        present: true,
        count: document.querySelectorAll('[data-netease-lyrics-layer]').length,
        rect: rectOf(layer),
        opacity: Number(style.opacity),
        zIndex: style.zIndex,
        position: style.position,
        display: style.display,
        visibility: style.visibility,
        pointerEvents: style.pointerEvents,
        ariaHidden: layer.getAttribute('aria-hidden'),
        line: line?.textContent ?? null,
        fontSize: line ? getComputedStyle(line).fontSize : null,
        lineColor: line ? getComputedStyle(line).color : null,
        lineRect: line ? rectOf(line) : null,
        focusableChildren: focusable.length,
      }
    }

    function useDiagnostics(snapshot, connection, hostNode) {
      React.useEffect(() => {
        if (!snapshot?.diag) return undefined
        installErrorCapture()
        let disposed = false
        let sending = false
        const tick = async () => {
          if (disposed || sending) return
          const controls = collectInteractive()
          const hits = sampleHitTesting(controls)
          const inputs = sampleInputFocus(controls)
          const layer = layerRecord(hostNode)
          const frame = hostNode?.parentElement
          const center = frame ? findCenterColumn(frame) : null
          const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
          let hiddenControls = []
          let hiddenScrollbar = scrollbar
          if (hostNode) {
            const previousDisplay = hostNode.style.display
            hostNode.style.display = 'none'
            hiddenControls = collectInteractive()
            hiddenScrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
            hostNode.style.display = previousDisplay
          }
          const visibleRects = controls.map(({ key, tag, rect }) => ({ key, tag, rect }))
          const hiddenRects = hiddenControls.map(({ key, tag, rect }) => ({ key, tag, rect }))
          const layout = {
            sameRects: JSON.stringify(visibleRects) === JSON.stringify(hiddenRects),
            sameScrollbar: scrollbar === hiddenScrollbar,
            visibleCount: visibleRects.length,
            hiddenCount: hiddenRects.length,
            visibleScrollbar: scrollbar,
            hiddenScrollbar,
            visible: visibleRects,
            hidden: hiddenRects,
          }
          const signature = JSON.stringify({
            line: snapshot.lineKey,
            visible: snapshot.visible,
            degraded: snapshot.degraded,
            playing: snapshot.playing,
            track: snapshot.trackTitle,
            width: window.innerWidth,
            dark: document.body.hasAttribute('data-ds-dark-theme'),
            center: center ? rectOf(center) : null,
            controls: controls.length,
            hits: hits.filter((entry) => !entry.passed).length,
            errors: diagState.errors.length,
            sameRects: layout.sameRects,
          })
          if (signature === diagState.lastSignature) return
          diagState.lastSignature = signature
          sending = true
          try {
            await connection.rpc.call(RPC_CHANNEL, 'diag', {
              type: 'sample',
              snapshot,
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio,
                scrollbarWidth: scrollbar,
                dark: document.body.hasAttribute('data-ds-dark-theme'),
              },
              frame: frame ? rectOf(frame) : null,
              center: center ? { key: 'conversation-center', rect: rectOf(center) } : null,
              layer,
              controls: controls.map(({ key, tag, rect }) => ({ key, tag, rect })),
              hits,
              inputs,
              layout,
              settingsProbe: {
                trigger: (() => {
                  const element = document.querySelector('[data-slot="settings.trigger"]')
                  return element
                    ? {
                        tag: element.tagName,
                        rect: rectOf(element),
                        closestButton: element.closest('button,[role="button"]')?.tagName ?? null,
                      }
                    : null
                })(),
                seat: (() => {
                  const element = document.querySelector('[data-slot="sidebar.settings"]')
                  if (!element) return null
                  return {
                    tag: element.tagName,
                    rect: rectOf(element),
                    button: element.querySelector('button,[role="button"]')?.outerHTML.slice(0, 300) ?? null,
                    html: element.outerHTML.slice(0, 500),
                  }
                })(),
                slots: [...document.querySelectorAll('[data-slot]')]
                  .map((element) => element.getAttribute('data-slot'))
                  .filter((name) => typeof name === 'string' && name.includes('settings')),
              },
              errors: [...diagState.errors],
            })
          } catch {
            // Diagnostics must never affect the visual layer.
          } finally {
            sending = false
          }
        }
        const timer = setInterval(tick, 1000)
        void tick()
        diagState.timer = timer
        return () => {
          disposed = true
          clearInterval(timer)
          diagState.timer = null
          diagState.restore?.()
        }
      }, [snapshot?.diag, snapshot?.lineKey, snapshot?.visible, snapshot?.degraded, snapshot?.playing, snapshot?.trackTitle, connection, hostNode])
    }

    function LyricsLayer({ connection, styleStore }) {
      const snapshot = useHostSnapshot(connection)
      const styleState = useStyleStore(styleStore)
      const style = styleState.style
      const anchorRef = React.useRef(null)
      const [hostNode, setHostNode] = React.useState(null)
      const displaySnapshot = snapshot
      const display = useCrossfade(displaySnapshot)
      const layout = useLayerLayout(hostNode)
      useDiagnostics(snapshot, connection, hostNode)

      React.useLayoutEffect(() => {
        const anchor = anchorRef.current
        if (!anchor) return undefined
        const overlay = anchor.closest('[data-shell-overlay]')
        const frame = overlay?.parentElement
        if (!frame) return undefined
        const node = document.createElement('div')
        node.setAttribute('data-netease-lyrics-layer', '')
        node.setAttribute('aria-hidden', 'true')
        node.setAttribute('role', 'presentation')
        frame.insertBefore(node, frame.firstChild)
        setHostNode(node)
        return () => {
          setHostNode(null)
          node.remove()
        }
      }, [])

      const visible =
        displaySnapshot?.visible === true && display.current !== null && window.innerWidth >= 900
      const opacity = visible
        ? displaySnapshot?.degraded === false
          ? style.opacity
          : 0.03
        : 0
      const currentFont = fitFont(display.current?.text ?? '', layout.baseFont, layout.maxWidth)
      const previousFont = fitFont(display.previous?.text ?? '', layout.baseFont, layout.maxWidth)

      React.useLayoutEffect(() => {
        if (!hostNode) return
        hostNode.style.setProperty('--nl-x', layout.x)
        hostNode.style.setProperty('--nl-y', layout.y)
        hostNode.style.setProperty(
          '--nl-color',
          style.mode === 'custom' ? style.color : 'var(--nl-auto-color)',
        )
        hostNode.style.opacity = String(opacity)
        hostNode.dataset.visible = opacity > 0 ? 'true' : 'false'
        hostNode.dataset.degraded = snapshot?.degraded === true ? 'true' : 'false'
        hostNode.dataset.lineKey = display.current?.key ?? ''
        hostNode.dataset.centerWidth = String(Math.round(layout.centerWidth))
      }, [
        hostNode,
        layout.x,
        layout.y,
        layout.centerWidth,
        opacity,
        style.mode,
        style.color,
        snapshot?.degraded,
        display.current?.key,
      ])

      const portal =
        hostNode === null
          ? null
          : ReactDOM.createPortal(
              h(
                'div',
                {
                  style: { position: 'absolute', inset: 0 },
                  'aria-hidden': 'true',
                },
                h('style', null, CSS),
                display.previous
                  ? h(
                      'span',
                      {
                        key: `out:${display.previous.key}`,
                        className: 'nl-line',
                        'data-phase': 'out',
                        'aria-hidden': 'true',
                        style: { fontSize: `${previousFont}px` },
                      },
                      display.previous.text,
                    )
                  : null,
                display.current
                  ? h(
                      'span',
                      {
                        key: `in:${display.current.key}`,
                        className: 'nl-line',
                        'data-phase': 'in',
                        'aria-hidden': 'true',
                        style: { fontSize: `${currentFont}px` },
                      },
                      display.current.text,
                    )
                  : null,
              ),
              hostNode,
            )

      return h(
        React.Fragment,
        null,
        h('span', {
          ref: anchorRef,
          hidden: true,
          'aria-hidden': 'true',
          'data-netease-lyrics-anchor': '',
        }),
        portal,
        hostNode
          ? null
          : h('span', {
              'aria-hidden': 'true',
              'data-netease-lyrics-placeholder': '',
              hidden: true,
            }),
      )
    }

    function LyricsSettings({ styleStore }) {
      const state = useStyleStore(styleStore)
      const style = state.style
      const dark = useDarkTheme()
      const { colorExpression, ratio } = useLyricContrast(style, dark)
      const [hexDraft, setHexDraft] = React.useState(style.color)
      const percent = Math.round(style.opacity * 100)
      const statusText =
        state.status === 'saving'
          ? '保存中…'
          : state.status === 'error'
            ? '保存失败；本页仍生效'
            : '已自动保存到本机'
      const ratioText = ratio === null ? '—' : `${ratio.toFixed(2)}:1`
      const ratioLabel =
        ratio === null ? '计算中' : ratio >= 3 ? '清楚' : ratio >= 1.8 ? '中等' : '偏淡'
      const ratioWidth = ratio === null ? 0 : Math.min(100, Math.max(3, (ratio / 3) * 100))
      const autoColor = autoColorExpression(dark)

      React.useEffect(() => {
        setHexDraft(style.color)
      }, [style.color])

      const applyColor = (color) => styleStore.update({ mode: 'custom', color })
      const commitHex = () => {
        const value = hexDraft.trim()
        if (/^#[0-9a-f]{6}$/i.test(value)) applyColor(value.toLowerCase())
        else setHexDraft(style.color)
      }

      return h(
        'div',
        { className: 'nl-settings' },
        h('style', null, SETTINGS_CSS),
        h(
          'div',
          { className: 'nl-settings-head' },
          h('h2', null, '歌词背景'),
          h('p', null, '调节网易云歌词的颜色与可见度。修改立即生效，并保存在本机浏览器。'),
        ),
        h(
          'div',
          { className: 'nl-preview', 'aria-label': '歌词颜色实时预览' },
          h('span', { className: 'nl-preview-label' }, '实时预览 · 当前主题'),
          h(
            'span',
            {
              className: 'nl-preview-word',
              style: { color: colorExpression, opacity: style.opacity },
            },
            '晚风吹过旧唱片',
          ),
        ),
        h(
          'div',
          { className: 'nl-settings-group' },
          h(
            'div',
            { className: 'nl-field-row' },
            h('span', { className: 'nl-field-label' }, '颜色'),
            h(
              'div',
              { className: 'nl-seg', role: 'group', 'aria-label': '歌词颜色模式' },
              h(
                'button',
                {
                  type: 'button',
                  'aria-pressed': style.mode === 'auto' ? 'true' : 'false',
                  onClick: () => styleStore.update({ mode: 'auto' }),
                },
                '跟随主题',
              ),
              h(
                'button',
                {
                  type: 'button',
                  'aria-pressed': style.mode === 'custom' ? 'true' : 'false',
                  onClick: () => styleStore.update({ mode: 'custom' }),
                },
                '自定义',
              ),
            ),
          ),
          style.mode === 'auto'
            ? h(
                'div',
                { className: 'nl-auto-chip' },
                h('span', {
                  className: 'nl-auto-dot',
                  style: { background: autoColor },
                  'aria-hidden': 'true',
                }),
                h(
                  'span',
                  null,
                  dark ? '深色主题：低饱和品牌红' : '浅色主题：墨灰',
                ),
              )
            : h(
                React.Fragment,
                null,
                h(
                  'div',
                  { className: 'nl-color-row' },
                  h('input', {
                    className: 'nl-color-input',
                    type: 'color',
                    value: style.color,
                    'aria-label': '选择歌词颜色',
                    onChange: (event) => applyColor(event.target.value),
                  }),
                  h('input', {
                    className: 'nl-hex',
                    type: 'text',
                    value: hexDraft,
                    spellCheck: false,
                    maxLength: 7,
                    'aria-label': '歌词颜色十六进制值',
                    onChange: (event) => setHexDraft(event.target.value),
                    onBlur: commitHex,
                    onKeyDown: (event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        commitHex()
                      }
                    },
                  }),
                  h(
                    'div',
                    { className: 'nl-color-row', role: 'group', 'aria-label': '颜色快捷选择' },
                    ...COLOR_SWATCHES.map((swatch) =>
                      h('button', {
                        key: swatch.color,
                        type: 'button',
                        className: 'nl-swatch',
                        style: { background: swatch.color },
                        title: swatch.label,
                        'aria-label': swatch.label,
                        onClick: () => applyColor(swatch.color),
                      }),
                    ),
                  ),
                ),
                h('p', { className: 'nl-hint' }, '颜色越亮，深色背景上越明显；浅色主题建议用深一些的颜色。'),
              ),
        ),
        h(
          'div',
          { className: 'nl-settings-group' },
          h(
            'div',
            { className: 'nl-field-row' },
            h('span', { className: 'nl-field-label' }, '显示强度'),
            h('span', { className: 'nl-field-value' }, `${percent}%`),
          ),
          h('input', {
            className: 'nl-range',
            type: 'range',
            min: 2,
            max: 35,
            step: 1,
            value: percent,
            'aria-label': '歌词显示强度',
            onChange: (event) => styleStore.update({ opacity: Number(event.target.value) / 100 }),
          }),
          h(
            'div',
            { className: 'nl-range-scale' },
            h('span', null, '淡'),
            h('span', null, '清楚'),
            h('span', null, '醒目'),
          ),
          h(
            'div',
            { className: 'nl-preset-row', role: 'group', 'aria-label': '显示强度快捷选择' },
            ...QUICK_OPACITIES.map((preset) =>
              h(
                'button',
                {
                  key: preset.value,
                  type: 'button',
                  className: 'nl-preset',
                  onClick: () => styleStore.update({ opacity: preset.value }),
                },
                h('span', {
                  className: 'nl-preset-dot',
                  style: { background: colorExpression },
                  'aria-hidden': 'true',
                }),
                preset.label,
              ),
            ),
          ),
          h('p', { className: 'nl-hint' }, '强度越高越显眼，但也会更抢正文；建议先试 14%。'),
        ),
        h(
          'div',
          { className: 'nl-settings-group' },
          h(
            'div',
            { className: 'nl-field-row' },
            h('span', { className: 'nl-field-label' }, '歌词 / 背景对比度'),
            h('span', { className: 'nl-field-value', 'aria-live': 'polite' }, ratioLabel),
          ),
          h(
            'div',
            { className: 'nl-contrast-head' },
            h('span', { className: 'nl-contrast-number' }, ratioText),
            h('span', { className: 'nl-contrast-badge' }, '按当前主题计算'),
          ),
          h(
            'div',
            { className: 'nl-meter', role: 'img', 'aria-label': `歌词与背景的对比度 ${ratioText}` },
            h('span', { style: { width: `${ratioWidth}%` } }),
          ),
          h(
            'p',
            { className: 'nl-hint' },
            '取当前背景与歌词颜色按显示强度合成后的相对亮度比；数字越大越清楚。',
          ),
        ),
        h(
          'div',
          { className: 'nl-footer' },
          h('span', { className: 'nl-status', 'aria-live': 'polite' }, statusText),
          h(
            'button',
            {
              type: 'button',
              className: 'nl-reset',
              onClick: () => styleStore.reset(),
            },
            '恢复默认',
          ),
        ),
      )
    }

    function QuickSettingsLayer({ styleStore }) {
      const [open, setOpen] = React.useState(false)
      const closeRef = React.useRef(null)
      const modalRef = React.useRef(null)
      const returnFocusRef = React.useRef(null)
      const settings = h(LyricsSettings, { styleStore })

      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.altKey && !event.ctrlKey && !event.metaKey && (event.key === 'l' || event.key === 'L')) {
            event.preventDefault()
            setOpen((value) => !value)
            return
          }
          if (event.key === 'Escape') setOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
      }, [])

      React.useEffect(() => {
        if (open) {
          returnFocusRef.current = document.activeElement
          const timer = setTimeout(() => closeRef.current?.focus(), 0)
          const keepFocus = (event) => {
            if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
              closeRef.current?.focus()
            }
          }
          document.addEventListener('focusin', keepFocus)
          return () => {
            clearTimeout(timer)
            document.removeEventListener('focusin', keepFocus)
            const previous = returnFocusRef.current
            if (previous instanceof HTMLElement) previous.focus({ preventScroll: true })
          }
        }
        return undefined
      }, [open])

      const onModalKeyDown = (event) => {
        if (event.key !== 'Tab' || !modalRef.current) return
        const focusable = [...modalRef.current.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
        )].filter((element) => element.offsetParent !== null)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }

      if (!open) return null
      return ReactDOM.createPortal(
        h(
          'div',
          {
            className: 'nl-modal-backdrop',
            onPointerDown: (event) => {
              if (event.target === event.currentTarget) setOpen(false)
            },
          },
          h(
            'div',
            {
              ref: modalRef,
              className: 'nl-modal',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': '歌词背景设置',
              onKeyDown: onModalKeyDown,
            },
            h(
              'button',
              {
                ref: closeRef,
                type: 'button',
                className: 'nl-modal-close',
                'aria-label': '关闭歌词颜色设置',
                onClick: () => setOpen(false),
              },
              '×',
            ),
            h(
              'div',
              { className: 'nl-shortcut', style: { paddingBottom: '10px' } },
              h('span', null, '随时按'),
              h('kbd', null, 'Alt'),
              h('span', null, '+'),
              h('kbd', null, 'L'),
              h('span', null, '打开此面板'),
            ),
            settings,
          ),
        ),
        document.body,
      )
    }

    function apply(ctx) {
      const styleStore = createStyleStore()
      ctx.effect(
        () => () => styleStore.dispose(),
        'netease-lyrics: persisted style store',
      )
      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'netease-lyrics-background',
            order: -1000,
            label: 'Netease lyric background',
          },
          () =>
            h(
              React.Fragment,
              null,
              h(LyricsLayer, { connection: ctx.connection, styleStore }),
              h(QuickSettingsLayer, { styleStore }),
            ),
        ),
      )
      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          {
            name: 'settings.section',
            id: 'netease-lyrics',
            order: 25,
            label: '歌词背景',
          },
          () => h(LyricsSettings, { styleStore }),
        ),
      )
    }

    return {
      inject: ['slots', 'connection'],
      apply,
    }
  },
})

