import { useEffect, useRef, useState, useCallback } from 'react'

const STATIONS = [
  { name: 'Lo-Fi Beats', url: 'https://streams.ilovemusic.de/iloveradio17.mp3' },
  { name: 'Jazz FM', url: 'https://jazz-wr04.ice.infomaniak.ch/jazz-wr04-128.mp3' },
  { name: 'Chill Station', url: 'https://streams.ilovemusic.de/iloveradio2.mp3' },
  { name: 'Classic Rock', url: 'https://streams.ilovemusic.de/iloveradio21.mp3' },
  { name: 'Deep House', url: 'https://streams.ilovemusic.de/iloveradio14.mp3' },
]

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$&'
const TOTAL_NOTCHES = 20
const BAR_COUNT = 24

export default function RotaryRadio() {
  const [isOn, setIsOn] = useState(false)
  const [stationIndex, setStationIndex] = useState(0)
  const [displayName, setDisplayName] = useState('- OFF -')
  const [rotation, setRotation] = useState(0)
  const [bars, setBars] = useState(() => Array(BAR_COUNT).fill(0))
  const [isScrubbing, setIsScrubbing] = useState(false)

  const audioRef = useRef(null)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)
  const sourceRef = useRef(null)
  const animFrameRef = useRef(null)
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

  const startVisualizer = useCallback(() => {
    if (!analyserRef.current) return
    const analyser = analyserRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const draw = () => {
      analyser.getByteFrequencyData(dataArray)
      const step = Math.floor(dataArray.length / BAR_COUNT)
      const newBars = []
      for (let i = 0; i < BAR_COUNT; i++) {
        newBars.push(dataArray[i * step] / 255)
      }
      setBars(newBars)
      animFrameRef.current = requestAnimationFrame(draw)
    }
    draw()
  }, [])

  const stopVisualizer = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    setBars(Array(BAR_COUNT).fill(0))
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
      startVisualizer()
    },
    [startVisualizer],
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
      stopVisualizer()
      setIsOn(false)
      scrambleTo('- OFF -')
    } else {
      setIsOn(true)
      scrambleTo(STATIONS[stationIndex].name)
      playStation(stationIndex)
    }
  }, [isOn, stationIndex, playStation, scrambleTo, stopVisualizer])

  /* Drag-to-rotate the dial */
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
        let delta = ((angle - dragRef.current.startAngle) * 180) / Math.PI
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
      stopVisualizer()
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {})
    }
  }, [stopVisualizer])

  const notches = Array.from({ length: TOTAL_NOTCHES }, (_, i) => {
    const angle = (i / TOTAL_NOTCHES) * 360
    return angle
  })

  return (
    <div className="rotary-radio">
      {/* LCD DISPLAY */}
      <div className="rr-display">
        <div className={`rr-display__inner ${isOn ? 'is-on' : ''}`}>
          <div className="rr-freq-label">
            FM {(87.5 + stationIndex * 4.2).toFixed(1)}
          </div>
          <div className={`rr-station-name ${isScrubbing ? 'is-scrubbing' : ''}`}>
            {displayName}
          </div>
          {/* Equalizer bars */}
          <div className="rr-eq">
            {bars.map((h, i) => (
              <div
                key={i}
                className="rr-eq__bar"
                style={{ height: `${Math.max(2, h * 100)}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ROTARY DIAL */}
      <div className="rr-dial-area">
        <div className="rr-dial-ring">
          {notches.map((a, i) => (
            <div
              key={i}
              className="rr-notch"
              style={{ transform: `rotate(${a}deg) translateY(-50px)` }}
            />
          ))}
        </div>
        <div
          ref={dialRef}
          className="rr-dial"
          style={{ transform: `rotate(${rotation}deg)` }}
          onPointerDown={handleDialPointerDown}
        >
          <div className="rr-dial__indicator" />
          <div className="rr-dial__grip rr-dial__grip--1" />
          <div className="rr-dial__grip rr-dial__grip--2" />
          <div className="rr-dial__grip rr-dial__grip--3" />
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="rr-controls">
        <button
          className={`rr-power ${isOn ? 'is-on' : ''}`}
          onClick={togglePower}
          aria-label="Power"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v10" />
            <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
          </svg>
        </button>
        <div className="rr-volume">
          <span className="rr-volume__label">VOL</span>
          <div className="rr-volume__dots">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className={`rr-volume__dot ${i < 4 ? 'is-active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
