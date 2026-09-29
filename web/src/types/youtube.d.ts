interface YtPlayer {
  playVideo: () => void
  pauseVideo: () => void
  loadVideoById: (id: string) => void
  cueVideoById: (id: string) => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  setVolume: (volume: number) => void
  mute: () => void
  unMute: () => void
  getCurrentTime: () => number
  getDuration: () => number
  destroy: () => void
}

interface YtPlayerOptions {
  videoId?: string
  width?: number
  height?: number
  playerVars?: Record<string, number | string>
  events?: {
    onReady?: () => void
    onStateChange?: (event: { data: number }) => void
  }
}

interface Window {
  YT?: {
    Player: new (elementId: string, options: YtPlayerOptions) => YtPlayer
  }
  onYouTubeIframeAPIReady?: () => void
}
