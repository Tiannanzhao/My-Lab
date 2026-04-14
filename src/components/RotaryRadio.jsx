import { useEffect, useRef, useState, useCallback } from 'react'

const STATIONS = [
  { name: 'Lo-Fi Beats', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
  { name: 'Jazz FM', url: 'https://jazz-wr04.ice.infomaniak.ch/jazz-wr04-128.mp3' },
  { name: 'Chill Station', url: 'https://streams.ilovemusic.de/iloveradio2.mp3' },
  { name: 'Classic Rock', url: 'https://streams.ilovemusic.de/iloveradio21.mp3' },
  { name: 'Deep House', url: 'https://streams.ilovemusic.de/iloveradio14.mp3' },
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const GRILLE_COLS = 20
const GRILLE_ROWS = 32

const SCRUB_DURATION_MS = 400
const STATIC_DURATION_MS = 600
const STATIC_GAIN = 0.35
const STATIC_FADE_FLOOR = 0.0001

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

  const noiseBufferRef = useRef(null)
  const staticSourceRef = useRef(null)
  const staticGainRef = useRef(null)

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

  const getStaticNoiseBuffer = useCallback((ctx) => {
    const length = Math.ceil((ctx.sampleRate * STATIC_DURATION_MS) / 1000)
    if (
      noiseBufferRef.current &&
      noiseBufferRef.current.sampleRate === ctx.sampleRate
    ) {
      return noiseBufferRef.current
    }
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1
    }
    noiseBufferRef.current = buffer
    return buffer
  }, [])

  const stopStaticNoise = useCallback(() => {
    try {
      if (staticSourceRef.current) {
        staticSourceRef.current.stop()
        staticSourceRef.current.disconnect()
      }
    } catch (_) {
      // swallow duplicate-stop errors
    }
    try {
      if (staticGainRef.current) {
        staticGainRef.current.disconnect()
      }
    } catch (_) {
      // swallow errors
    }
    staticSourceRef.current = null
    staticGainRef.current = null
  }, [])

  const playStaticNoise = useCallback(async () => {
    const ctx = audioCtxRef.current
    if (!isOn || !ctx || ctx.state === 'closed') return

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    stopStaticNoise()

    const buffer = getStaticNoiseBuffer(ctx)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(STATIC_GAIN, ctx.currentTime)

    source.connect(gain)
    gain.connect(ctx.destination)

    staticSourceRef.current = source
    staticGainRef.current = gain

    source.start()
  }, [isOn, getStaticNoiseBuffer, stopStaticNoise])

  const fadeOutStaticNoise = useCallback(() => {
    const ctx = audioCtxRef.current
    if (!ctx || !staticGainRef.current || !staticSourceRef.current) return
    try {
      staticGainRef.current.gain.cancelScheduledValues(ctx.currentTime)
      staticGainRef.current.gain.setValueAtTime(staticGainRef.current.gain.value, ctx.currentTime)
      staticGainRef.current.gain.linearRampToValueAtTime(STATIC_FADE_FLOOR, ctx.currentTime + 0.15)
      staticSourceRef.current.stop(ctx.currentTime + 0.15)
    } catch (_) {}
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

      setRotation(wrapped * (360 / STATIONS.length))
    },
    [scrambleTo],
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

      // Pause music and start continuous static noise on drag start
      if (isOn) {
        audioRef.current?.pause()
        playStaticNoise()
      }

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

        // Fade out static noise and resume the selected station
        fadeOutStaticNoise()
        setIsScrubbing(false)
        if (isOn) {
          const idx = dragRef.current.lastIndex
          scrubTimeoutRef.current = setTimeout(() => {
            playStation(idx)
          }, 180)
        }
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [rotation, stationIndex, changeStation, isOn, playStaticNoise, fadeOutStaticNoise, playStation],
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
          className={`rr-toggle ${isOn ? 'is-on' : ''}`}
          onClick={togglePower}
          aria-label="Power"
        >
          <span className="rr-toggle__base">
            <span className="rr-toggle__bowl">
              <span className="rr-toggle__lever">
                <span className="rr-toggle__knob" />
              </span>
            </span>
          </span>
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
          >
            <span className="rr-dial__indicator" />
          </div>
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
