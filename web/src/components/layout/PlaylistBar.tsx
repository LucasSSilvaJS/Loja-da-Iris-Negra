import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import AudioPlayer, { useAudioPlayerVolume } from 'react-modern-audio-player'
import { playlistService } from '../../services/playlist.service'
import type { Track } from '../../types/domain'

const activeUI = {
  playButton: true,
  prevNnext: true,
  volume: false,
  volumeSlider: false,
  repeatType: true,
  trackTime: true,
  trackInfo: true,
  artwork: false,
  progress: 'bar',
  playList: 'unSortable',
  playbackRate: false,
} as const

const placement = {
  player: 'bottom',
  playList: 'top',
  interface: {
    templateArea: {
      trackInfo: 'row1-1',
      trackTimeCurrent: 'row1-5',
      trackTimeDuration: 'row1-5',
      progress: 'row2-1',
      repeatType: 'row3-2',
      playButton: 'row3-3',
      playList: 'row3-4',
    },
    customComponentsArea: {
      volumeRail: 'row3-5',
    },
  },
} as const

const audioInitialState = {
  volume: 0.7,
  repeatType: 'ALL',
  curPlayId: 1,
  playListExpanded: false,
} as const

const rootContainerProps = {
  className: 'loja-player',
  style: { zIndex: 20, left: 0, right: 0 },
}

export function PlaylistBar() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    playlistService
      .list()
      .then((list) => {
        if (!active) return
        setTracks(list)
        setPhase(list.some((track) => track.previewUrl) ? 'ready' : 'error')
      })
      .catch(() => {
        if (active) setPhase('error')
      })
    return () => {
      active = false
    }
  }, [attempt])

  useEffect(() => {
    const root = document.documentElement
    const player = document.querySelector('.loja-player')
    const bar = player?.querySelector('.rmap-interface-container')
    if (!(player instanceof HTMLElement) || !(bar instanceof HTMLElement)) return
    const apply = () => {
      root.style.setProperty('--player', `${Math.ceil(bar.getBoundingClientRect().height)}px`)
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(player)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--player')
    }
  }, [tracks])

  const playList = useMemo(
    () =>
      tracks.flatMap((track, index) => {
        if (!track.previewUrl) return []
        return [{
          id: index + 1,
          name: track.title,
          writer: track.artist,
          description: track.album,
          src: track.previewUrl,
        }]
      }),
    [tracks],
  )

  if (phase !== 'ready' || playList.length === 0) {
    return (
      <PlayerHold
        phase={phase}
        onRetry={() => {
          setPhase('loading')
          setAttempt((current) => current + 1)
        }}
      />
    )
  }

  return (
    <AudioPlayer
      playList={playList}
      colorScheme="dark"
      audioInitialState={audioInitialState}
      activeUI={activeUI}
      placement={placement}
      rootContainerProps={rootContainerProps}
    >
      <AudioPlayer.CustomComponent id="volumeRail">
        <VolumeRail />
      </AudioPlayer.CustomComponent>
    </AudioPlayer>
  )
}

function PlayerHold({ phase, onRetry }: { phase: 'loading' | 'error'; onRetry: () => void }) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const node = bar.current
    if (!node) return
    const apply = () => {
      root.style.setProperty('--player', `${Math.ceil(node.getBoundingClientRect().height)}px`)
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(node)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--player')
    }
  }, [])

  const waiting = phase === 'loading'

  return (
    <div ref={bar} className="player-hold" role="status" aria-live="polite">
      <p className="pixel">playlist</p>
      <p className="player-hold-title">{waiting ? 'abrindo as faixas' : 'as faixas não chegaram'}</p>
      {waiting ? (
        <span className="player-hold-track" aria-hidden="true">
          <span className="player-hold-bar" />
        </span>
      ) : (
        <button type="button" className="player-hold-retry" onClick={onRetry}>
          tentar de novo
        </button>
      )}
    </div>
  )
}

function VolumeRail() {
  const { volume, muted, setVolume, toggleMute } = useAudioPlayerVolume()
  const level = muted ? 0 : volume
  const silent = level === 0

  return (
    <div className="loja-volume">
      <button
        type="button"
        className="loja-volume-mute"
        aria-label={silent ? 'Ativar som' : 'Silenciar'}
        aria-pressed={muted}
        onClick={toggleMute}
      >
        {silent ? <MdVolumeOff aria-hidden="true" /> : <MdVolumeUp aria-hidden="true" />}
      </button>
      <input
        className="loja-volume-range"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={level}
        style={{ '--level': String(level) } as CSSProperties}
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(level * 100)}
        aria-valuetext={`${Math.round(level * 100)} por cento`}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (muted && next > 0) toggleMute()
          setVolume(next)
        }}
      />
    </div>
  )
}
