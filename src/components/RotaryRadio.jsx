import { useEffect, useRef, useState, useCallback } from 'react'

const STATIONS = [
  { name: 'Lo-Fi Beats', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
  { name: 'Jazz FM', url: 'https://jazz-wr04.ice.infomaniak.ch/jazz-wr04-128.mp3' },
  { name: 'Chill Station', url: 'https://streams.ilovemusic.de/iloveradio2.mp3' },
  { name: 'Classic Rock', url: 'https://streams.ilovemusic.de/iloveradio21.mp3' },
  { name: 'Deep House', url: 'https://streams.ilovemusic.de/iloveradio14.mp3' },
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const GRILLE_COLS = 18
const GRILLE_ROWS = 14

function useCurrentTime() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const hh = String(time.getHours()).padStart(2, '0')
  const mm = String(time.getMinutes()).padStart(2, '0')
  const day = time.getDate()
  const month = time.toLocaleString('en', { month: 'short' })
  return `${hh}:${mm}  ${day} ${month}`
}

export default function RotaryRadio() {
  const [isOn, setIsOn] = useState(false)
  const [stationIndex, setStationIndex] = useState(0)
  const [displayName, setDisplayName] = useState('OFFLINE')
  const [rotation, setRotation] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const clock = useCurrentTime()

  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)
  const sourceRef = useRef(null)
  const scrubTimeoutRef = useRef(null)
  const dialRef = useRef(null)
  const dragRef = useRef(null)

  const scrambleTo = useCallback((target) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 1
      const result = target
        .split('')
        .map((ch, i) => {
          if (i < progress) return target[i]
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
        .join('')
      setDisplayName(result)
      if (progress >= target.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const playStation = useCallback(
    (index) => {
      const audio = audioRef.current
      if (!audio) return

      audio.pause()
      audio.src = STATIONS[index].url
      audio.crossOrigin = 'anonymous'
      audio.load()

      if (!audioCtxRef.current) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        audioCtxRef.current = ctx
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 128
        analyserRef.current = analyser
        const source = ctx.createMediaElementSource(audio)
        source.connect(analyser)
        analyser.connect(ctx.destination)
        sourceRef.current = source
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      audio.play().catch(() => {})
    },
    [],
  )

  const changeStation = useCallback(
    (newIndex) => {
      const wrapped = ((newIndex % STATIONS.length) + STATIONS.length) % STATIONS.length
      setStationIndex(wrapped)
      setIsScrubbing(true)

      if (scrubTimeoutRef.current) clearTimeout(scrubTimeoutRef.current)

      scrambleTo(STATIONS[wrapped].name)

      scrubTimeoutRef.current = setTimeout(() => {
        setIsScrubbing(false)
        if (isOn) playStation(wrapped)
      }, 400)

      setRotation(wrapped * (360 / STATIONS.length))
    },
    [isOn, playStation, scrambleTo],
  )

  const togglePower = useCallback(() => {
    if (isOn) {
      audioRef.current?.pause()
      setIsOn(false)
      scrambleTo('OFFLINE')
    } else {
      setIsOn(true)
      scrambleTo(STATIONS[stationIndex].name)
      playStation(stationIndex)
    }
  }, [isOn, stationIndex, playStation, scrambleTo])

  const handleDialPointerDown = useCallback(
    (e) => {
      e.preventDefault()
      const rect = dialRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx)
      dragRef.current = { startAngle, startRotation: rotation, lastIndex: stationIndex }

      const onMove = (ev) => {
        const angle = Math.atan2(ev.clientY - cy, ev.clientX - cx)
        const delta = ((angle - dragRef.current.startAngle) * 180) / Math.PI
        const newRot = dragRef.current.startRotation + delta
        setRotation(newRot)

        const stationAngle = 360 / STATIONS.length
        const normalRot = ((newRot % 360) + 360) % 360
        const newIdx = Math.round(normalRot / stationAngle) % STATIONS.length
        if (newIdx !== dragRef.current.lastIndex) {
          dragRef.current.lastIndex = newIdx
          changeStation(newIdx)
        }
      }

      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [rotation, stationIndex, changeStation],
  )

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.volume = 0.5
    return () => {
      audioRef.current?.pause()
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {})
    }
  }, [])

  return (
    <div className="rotary-radio">
      {/* TOP BAR: power + LCD */}
      <div className="rr-header">
        <button
          className={`rr-power ${isOn ? 'is-on' : ''}`}
          onClick={togglePower}
          aria-label="Power"
        >
          <span className="rr-power__dot" />
        </button>
        <div className="rr-lcd">
          <div className={`rr-lcd__text ${isScrubbing ? 'is-scrubbing' : ''}`}>
            {displayName}
          </div>
          <div className="rr-lcd__clock">{clock}</div>
        </div>
      </div>

      {/* SPEAKER GRILLE */}
      <div className="rr-grille">
        {Array.from({ length: GRILLE_ROWS * GRILLE_COLS }, (_, i) => (
          <span key={i} className="rr-grille__dot" />
        ))}
      </div>

      {/* DIVIDER DOTS */}
      <div className="rr-divider">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="rr-divider__dot" />
        ))}
      </div>

      {/* BOTTOM: brand + dial + volume */}
      <div className="rr-bottom">
        <div className="rr-brand">
          <span className="rr-brand__name">RADIO</span>
          <span className="rr-brand__sub">Web Player</span>
        </div>
        <div className="rr-dial-wrap">
          <div
            ref={dialRef}
            className="rr-dial"
            style={{ transform: `rotate(${rotation}deg)` }}
            onPointerDown={handleDialPointerDown}
          />
        </div>
        <div className="rr-volume-dots">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className={`rr-vol-dot ${isOn && i < 5 ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
