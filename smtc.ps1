$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties, Windows.Media.Control, ContentType = WindowsRuntime] | Out-Null

$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
  $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.IsGenericMethod
})[0]

function Await-Operation($operation, $resultType) {
  $task = $asTask.MakeGenericMethod($resultType).Invoke($null, @($operation))
  if (-not $task.Wait(5000)) { throw 'WinRT operation timed out' }
  return $task.Result
}

function Write-JsonLine($value) {
  [Console]::Out.WriteLine(($value | ConvertTo-Json -Compress -Depth 5))
  [Console]::Out.Flush()
}

try {
  $manager = Await-Operation `
    ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()) `
    ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])

  while ($true) {
    try {
      $sessions = $manager.GetSessions()
      $sessions = @($sessions | Where-Object {
        $_.SourceAppUserModelId -match '(?i)(cloudmusic|netease)'
      })

      if ($sessions.Count -eq 0) {
        Write-JsonLine @{ ok = $true; session = $false }
      }
      else {
        $playing = @($sessions | Where-Object {
          $_.GetPlaybackInfo().PlaybackStatus.ToString() -eq 'Playing'
        })
        if ($playing.Count -gt 0) { $target = $playing[0] }
        else { $target = $sessions[0] }

        $playback = $target.GetPlaybackInfo()
        $props = Await-Operation ($target.TryGetMediaPropertiesAsync()) `
          ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
        $timeline = $target.GetTimelineProperties()
        $status = $playback.PlaybackStatus.ToString()
        $position = $timeline.Position.TotalMilliseconds
        $end = $timeline.EndTime.TotalMilliseconds

        # Some clients (including Netease) leave Position at zero and only
        # update LastUpdatedTime. Give the Host a usable SMTC hint when the
        # client does report a running timeline; the Host keeps its own clock
        # when the hint stays at zero.
        if ($status -eq 'Playing' -and $position -gt 0) {
          $delta = ([DateTimeOffset]::UtcNow - $timeline.LastUpdatedTime).TotalMilliseconds
          if ($delta -ge 0 -and $delta -lt 10000) { $position += $delta }
        }

        Write-JsonLine @{
          ok = $true
          session = $true
          appId = [string]$target.SourceAppUserModelId
          title = [string]$props.Title
          artist = [string]$props.Artist
          status = $status
          positionMs = [Math]::Round([double]$position)
          endMs = [Math]::Round([double]$end)
        }
      }
    }
    catch {
      Write-JsonLine @{ ok = $false }
    }

    Start-Sleep -Milliseconds 300
  }
}
catch {
  Write-JsonLine @{ ok = $false }
  exit 1
}
