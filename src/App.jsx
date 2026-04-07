import { useEffect, useMemo, useRef, useState } from 'react'
import './app.css'
import { articlesData, cards, intercomAsset } from './siteData'

const MIN_CANVAS_WIDTH = 4320
const MIN_CANVAS_HEIGHT = 2640
const CANVAS_RATIO = MIN_CANVAS_WIDTH / MIN_CANVAS_HEIGHT
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
const COMMAND_PANEL_DESIGN = { width: 620, height: 296 }
const COMMAND_PANEL_REPLACEMENT_ID = 'yt-transition'
const COMMAND_PANEL_LINK =
  'https://chromewebstore.google.com/detail/arrowprompt-ai-coding-sho/dkbcpkedebdmddoaebgejhaieelflfef'
const COMMAND_PANEL_LABEL = 'ArrowPrompt - AI Coding Shortcuts extension'
const COMMAND_DOT_PATTERNS = {
  up: [1, 3, 4, 5, 7, 10, 13],
  down: [1, 4, 7, 9, 10, 11, 13],
  left: [2, 6, 10, 11, 12, 13, 14],
  right: [2, 8, 10, 11, 12, 13, 14],
}

function calculateCanvasDimensions(viewportWidth, viewportHeight) {
  const isMobile = viewportWidth <= 600
  let width = viewportWidth * 2
  let height = width / CANVAS_RATIO

  width = Math.max(width, MIN_CANVAS_WIDTH)
  height = Math.max(height, MIN_CANVAS_HEIGHT)

  if (isMobile) {
    width *= 0.8
    height *= 0.8
  }

  return { width, height }
}

function clampOffset(nextX, nextY, canvasSize, viewport) {
  const minX = viewport.width - canvasSize.width
  const minY = viewport.height - canvasSize.height

  return {
    x: Math.min(0, Math.max(nextX, minX)),
    y: Math.min(0, Math.max(nextY, minY)),
  }
}

function getCardFrame(card, viewportWidth) {
  const isMobile = viewportWidth <= 768
  const isSmallMobile = viewportWidth <= 480

  switch (card.type) {
    case 'video':
      if (card.link) {
        if (isSmallMobile) return { width: 280, height: 157 }
        if (isMobile) return { width: 350, height: 197 }
        return { width: 450, height: 253 }
      }
      if (isSmallMobile) return { width: 320, height: 180 }
      if (isMobile) return { width: 400, height: 225 }
      return { width: 600, height: 338 }
    case 'image':
      if (card.originalSize) {
        return isMobile ? { width: 280, height: 320 } : { width: 380, height: 420 }
      }
      return isMobile ? { width: 320, height: 213 } : { width: 600, height: 400 }
    case 'youtube':
      if (isSmallMobile) return { width: 300, height: 169 }
      if (isMobile) return { width: 360, height: 202 }
      return { width: 450, height: 253 }
    case 'spotify':
      if (isSmallMobile) return { width: 320, height: 132 }
      if (isMobile) return { width: 380, height: 142 }
      return { width: 450, height: 152 }
    case 'text':
      if (isSmallMobile) return { width: 280, height: 270 }
      if (isMobile) return { width: 350, height: 280 }
      return { width: 480, height: 320 }
    case 'folder':
      return { width: 120, height: 140 }
    case 'blockquote':
      if (isSmallMobile) return { width: 280, height: 320 }
      if (isMobile) return { width: 350, height: 340 }
      return { width: 420, height: 340 }
    case 'logo':
      return { width: isMobile ? 400 : 600, height: isMobile ? 180 : 230 }
    default:
      return { width: 300, height: 200 }
  }
}

function getCardCoordinates(card, frame, canvasSize) {
  const topPercent = Number.parseFloat(card.top) / 100
  const leftPercent = Number.parseFloat(card.left) / 100
  const top = canvasSize.height * topPercent
  const left = canvasSize.width * leftPercent - (card.centered ? frame.width / 2 : 0)

  return { top, left }
}

function HoverScrambleText({ text, as: Tag = 'span', className, ...props }) {
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef(null)

  useEffect(() => {
    setDisplayText(text)
  }, [text])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [])

  const stopScramble = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startScramble = () => {
    stopScramble()
    let progress = 0

    intervalRef.current = window.setInterval(() => {
      progress += 1 / 3
      const nextText = text
        .split('')
        .map((char, index) => {
          if (!/[A-Za-z0-9]/.test(char)) return char
          if (index < progress) return text[index]
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
        .join('')

      setDisplayText(nextText)

      if (progress >= text.length) {
        stopScramble()
        setDisplayText(text)
      }
    }, 22)
  }

  return (
    <Tag
      className={className}
      onMouseEnter={startScramble}
      onMouseLeave={() => {
        stopScramble()
        setDisplayText(text)
      }}
      {...props}
    >
      {displayText}
    </Tag>
  )
}

function ShinyHoverText({ text, className }) {
  return (
    <span className={className}>
      <span className="shiny-hover-text">{text}</span>
    </span>
  )
}

function highlightQuote(text, highlight, colorClass) {
  if (!highlight || !text.includes(highlight)) return text

  const parts = text.split(highlight)

  return (
    <>
      {parts[0]}
      <span className="quote-highlight" style={{ background: `var(--${colorClass})` }}>
        {highlight}
      </span>
      {parts[1]}
    </>
  )
}

function Minimap({ layoutCards, hoveredType, canvasSize, viewport, offset }) {
  if (viewport.width <= 768) return null

  const width = 320
  const height = Math.round((canvasSize.height / canvasSize.width) * width)
  const scaleX = width / canvasSize.width
  const scaleY = height / canvasSize.height
  const viewportRect = {
    left: -offset.x * scaleX,
    top: -offset.y * scaleY,
    width: viewport.width * scaleX,
    height: viewport.height * scaleY,
  }

  return (
    <div className={`minimap ${hoveredType ? `highlight-${hoveredType}` : ''}`} style={{ width, height }}>
      <div className="map-viewport" style={viewportRect} />
      {layoutCards.map((card) => (
        <div
          key={`${card.id}-mini`}
          className={`minimap-card minimap-card--${card.type}`}
          style={{
            left: card.position.left * scaleX,
            top: card.position.top * scaleY,
            width: Math.max(8, card.frame.width * scaleX),
            height: Math.max(8, card.frame.height * scaleY),
          }}
        />
      ))}
    </div>
  )
}

function ArticlesModal({ folder, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{folder.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            X
          </button>
        </div>
        <div className="article-list">
          {folder.articles.map((article, index) => (
            <a
              key={article.url}
              className="article-item"
              href={article.url}
              target="_blank"
              rel="noreferrer"
              style={{ '--accent-color': `var(--accent-sequence-${(index % 5) + 1})` }}
            >
              <span className="article-author">{article.author}</span>
              <h3 className="article-title">{article.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function VideoModal({ video, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="overlay overlay--video" onClick={onClose}>
      <div className="video-modal" onClick={(event) => event.stopPropagation()}>
        <video className="video-modal__media" src={video.src} autoPlay muted={false} loop controls playsInline />
        <button className="video-modal__close" onClick={onClose} aria-label="Close video">
          ×
        </button>
      </div>
    </div>
  )
}

function LogoByline() {
  return (
    <p className="logo-byline">
      This is where I experiment. I design products. I also build them. With AI, fast, and from
      scratch.
    </p>
  )
}

function DirectionDots({ direction }) {
  const total = direction === 'up' || direction === 'down' ? 15 : 25

  return (
    <div className={`lab-dots ${direction === 'up' || direction === 'down' ? 'lab-dots--v' : 'lab-dots--h'}`}>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={`${direction}-${index}`}
          className={`lab-dot ${COMMAND_DOT_PATTERNS[direction].includes(index) ? 'is-active' : ''}`}
        />
      ))}
    </div>
  )
}

function CommandPanel({ panel, onHoverType }) {
  return (
    <a
      className="card-shell card-shell--command-panel"
      href={COMMAND_PANEL_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label={COMMAND_PANEL_LABEL}
      style={{
        top: panel.position.top,
        left: panel.position.left,
        width: panel.frame.width,
        height: panel.frame.height,
        '--enter-delay': '960ms',
      }}
      onPointerEnter={() => {
        onHoverType('widget')
      }}
      onPointerLeave={() => {
        onHoverType(null)
      }}
      data-interactive="true"
    >
      <div className="card-title card-title--command">{COMMAND_PANEL_LABEL}</div>
      <div className="lab-command-scale" style={{ transform: `scale(${panel.scale})` }}>
        <div className="lab-command-panel">
          <div className="lab-command-key lab-command-key--top">
            <div className="lab-command-arrow-wrap">
              <DirectionDots direction="up" />
            </div>
            <span className="lab-command-text">Explain code</span>
          </div>

          <div className="lab-command-key lab-command-key--left">
            <div className="lab-command-inline">
              <DirectionDots direction="left" />
              <span className="lab-command-text">Fix bug</span>
            </div>
          </div>

          <div className="lab-command-key lab-command-key--bottom">
            <span className="lab-command-text">Optimize</span>
            <div className="lab-command-arrow-wrap">
              <DirectionDots direction="down" />
            </div>
          </div>

          <div className="lab-command-key lab-command-key--right">
            <div className="lab-command-inline">
              <span className="lab-command-text">Translate</span>
              <DirectionDots direction="right" />
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

function CanvasCard({ card, frame, index, onFolderOpen, onVideoOpen, onHoverType }) {
  const wrapperStyle = {
    top: card.top,
    left: card.left,
    width: frame.width,
    '--enter-delay': `${index * 80}ms`,
  }

  if (card.centered) {
    wrapperStyle.marginLeft = -(frame.width / 2)
  }

  if (card.type === 'logo') {
    const lines = card.lines ?? [card.text]

    return (
      <div
        className="card-shell card-shell--logo"
        style={wrapperStyle}
        onMouseEnter={() => onHoverType(card.type)}
        onMouseLeave={() => onHoverType(null)}
        data-interactive="true"
      >
        <div className="logo-card">
          {lines.map((line) => (
            <p key={line} className="logo-line">
              <ShinyHoverText text={line} />
            </p>
          ))}
          <LogoByline />
        </div>
      </div>
    )
  }

  if (card.type === 'folder') {
    return (
      <button
        className="card-shell card-shell--folder"
        style={wrapperStyle}
        onClick={() => onFolderOpen(card.folderId)}
        onMouseEnter={() => onHoverType(card.type)}
        onMouseLeave={() => onHoverType(null)}
        data-interactive="true"
      >
        <div className="folder-card">
          <img src={intercomAsset('icons/folder.png')} alt="" draggable="false" />
          <span>{card.label}</span>
        </div>
      </button>
    )
  }

  if (card.type === 'image') {
    return (
      <div
        className="card-shell"
        style={wrapperStyle}
        onMouseEnter={() => onHoverType(card.type)}
        onMouseLeave={() => onHoverType(null)}
        data-interactive="true"
      >
        <div className="card-title">{card.label}</div>
        <div className="card-frame card-frame--image" style={{ height: frame.height }}>
          <img className="media-image" src={card.src} alt="" draggable="false" />
        </div>
      </div>
    )
  }

  if (card.type === 'video') {
    const interactiveProps = card.link
      ? {
          as: 'a',
          href: card.link,
          target: '_blank',
          rel: 'noreferrer',
        }
      : {
          as: 'button',
          onClick: () => onVideoOpen(card),
          type: 'button',
        }

    const Tag = interactiveProps.as
    delete interactiveProps.as

    return (
      <div
        className="card-shell"
        style={wrapperStyle}
        onMouseEnter={() => onHoverType(card.type)}
        onMouseLeave={() => onHoverType(null)}
        data-interactive="true"
      >
        <div className="card-title">{card.label}</div>
        <Tag className="card-frame card-frame--video" style={{ height: frame.height }} {...interactiveProps}>
          <video className="media-video" src={card.src} autoPlay muted loop playsInline />
          <div className="video-hover-overlay" />
        </Tag>
      </div>
    )
  }

  if (card.type === 'youtube') {
    return (
      <a
        className="card-shell"
        href={`https://www.youtube.com/watch?v=${card.embedId}`}
        target="_blank"
        rel="noreferrer"
        style={wrapperStyle}
        onMouseEnter={() => onHoverType(card.type)}
        onMouseLeave={() => onHoverType(null)}
        data-interactive="true"
      >
        <div className="card-title">{card.label}</div>
        <div className="card-frame card-frame--youtube" style={{ height: frame.height }}>
          <div
            className="youtube-thumbnail"
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${card.embedId}/maxresdefault.jpg)`,
            }}
          />
          <div className="youtube-play">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 5.14v14l11-7-11-7z" fill="rgba(255,255,255,0.92)" />
            </svg>
          </div>
        </div>
      </a>
    )
  }

  if (card.type === 'spotify') {
    const embedId = card.embedId.startsWith('episode/') ? card.embedId : `episode/${card.embedId}`

    return (
      <div
        className="card-shell"
        style={wrapperStyle}
        onMouseEnter={() => onHoverType(card.type)}
        onMouseLeave={() => onHoverType(null)}
        data-interactive="true"
      >
        <div className="card-title">{card.label}</div>
        <div className="card-frame card-frame--spotify" style={{ height: frame.height }}>
          <iframe
            title={card.label}
            src={`https://open.spotify.com/embed/${embedId}?theme=0`}
            width="100%"
            height={frame.height}
            frameBorder="0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      </div>
    )
  }

  if (card.type === 'text') {
    return (
      <div
        className="card-shell"
        style={wrapperStyle}
        onMouseEnter={() => onHoverType(card.type)}
        onMouseLeave={() => onHoverType(null)}
        data-interactive="true"
      >
        <div className="card-title card-title--multiline">{card.label}</div>
        <article className="card-frame card-frame--text">
          <div className="text-card-copy">
            {card.paragraph.split('\n').map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <a className="read-more" href={card.link} target="_blank" rel="noreferrer">
            <HoverScrambleText text="READ MORE" />
          </a>
        </article>
      </div>
    )
  }

  return (
    <a
      className="card-shell card-shell--quote"
      href={card.link}
      target="_blank"
      rel="noreferrer"
      style={wrapperStyle}
      onMouseEnter={() => onHoverType(card.type)}
      onMouseLeave={() => onHoverType(null)}
      data-interactive="true"
    >
      <article className="quote-card">
        <div className="quote-copy">{highlightQuote(card.text, card.highlight, card.highlightColor)}</div>
        <div className="read-more read-more--inline">
          <HoverScrambleText text="READ MORE" />
        </div>
      </article>
    </a>
  )
}

export default function App() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const dragStateRef = useRef(null)
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isIlluminated, setIsIlluminated] = useState(false)
  const [hoveredType, setHoveredType] = useState(null)
  const [openFolderId, setOpenFolderId] = useState(null)
  const [openVideo, setOpenVideo] = useState(null)

  const canvasSize = useMemo(
    () => calculateCanvasDimensions(viewport.width, viewport.height),
    [viewport.height, viewport.width]
  )

  const visibleCards = useMemo(
    () => cards.filter((card) => card.id !== COMMAND_PANEL_REPLACEMENT_ID),
    []
  )

  const replacedCard = useMemo(
    () => cards.find((card) => card.id === COMMAND_PANEL_REPLACEMENT_ID),
    []
  )

  const layoutCards = useMemo(
    () =>
      visibleCards.map((card) => {
        const frame = getCardFrame(card, viewport.width)
        const position = getCardCoordinates(card, frame, canvasSize)

        return { ...card, frame, position }
      }),
    [canvasSize, viewport.width, visibleCards]
  )

  const commandPanel = useMemo(() => {
    const anchorFrame = getCardFrame(replacedCard, viewport.width)
    const anchorPosition = getCardCoordinates(replacedCard, anchorFrame, canvasSize)
    const scale = Math.min(1, anchorFrame.width / COMMAND_PANEL_DESIGN.width)
    const frame = {
      width: COMMAND_PANEL_DESIGN.width * scale,
      height: COMMAND_PANEL_DESIGN.height * scale,
    }
    const position = {
      left: anchorPosition.left,
      top: anchorPosition.top + (anchorFrame.height - frame.height) / 2,
    }

    return {
      id: 'command-panel',
      type: 'widget',
      frame,
      position,
      scale,
    }
  }, [canvasSize, replacedCard, viewport.width])

  const minimapCards = useMemo(() => [...layoutCards, commandPanel], [commandPanel, layoutCards])

  useEffect(() => {
    document.title = 'Intercom Design'
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const centered = {
      x: (viewport.width - canvasSize.width) / 2,
      y: (viewport.height - canvasSize.height) / 2,
    }
    setOffset(clampOffset(centered.x, centered.y, canvasSize, viewport))
  }, [canvasSize.height, canvasSize.width, viewport])

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!dragStateRef.current) return

      const next = clampOffset(
        dragStateRef.current.origin.x + event.clientX - dragStateRef.current.start.x,
        dragStateRef.current.origin.y + event.clientY - dragStateRef.current.start.y,
        canvasSize,
        viewport
      )

      setOffset(next)
    }

    const handlePointerUp = () => {
      dragStateRef.current = null
      document.body.classList.remove('is-dragging-canvas')
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [canvasSize, viewport])

  const updateCursorPosition = (clientX, clientY) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    canvasRef.current.style.setProperty('--cursor-x', `${clientX - rect.left}px`)
    canvasRef.current.style.setProperty('--cursor-y', `${clientY - rect.top}px`)
  }

  const handleWheel = (event) => {
    event.preventDefault()
    const next = clampOffset(
      offset.x - event.deltaX * 1.8,
      offset.y - event.deltaY * 1.8,
      canvasSize,
      viewport
    )
    setOffset(next)
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0) return
    if (event.target.closest('[data-interactive="true"]')) return

    dragStateRef.current = {
      start: { x: event.clientX, y: event.clientY },
      origin: offset,
    }
    document.body.classList.add('is-dragging-canvas')
  }

  return (
    <div className="app-shell">
      <Minimap
        layoutCards={minimapCards}
        hoveredType={hoveredType}
        canvasSize={canvasSize}
        viewport={viewport}
        offset={offset}
      />

      <div
        ref={containerRef}
        className="canvas-container"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setIsIlluminated(true)}
        onPointerLeave={() => setIsIlluminated(false)}
        onPointerMove={(event) => updateCursorPosition(event.clientX, event.clientY)}
      >
        <div
          ref={canvasRef}
          className={`canvas ${isIlluminated ? 'is-illuminated' : ''}`}
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          }}
        >
          {layoutCards.map((card, index) => (
            <CanvasCard
              key={card.id}
              card={card}
              frame={card.frame}
              index={index}
              onFolderOpen={setOpenFolderId}
              onVideoOpen={setOpenVideo}
              onHoverType={setHoveredType}
            />
          ))}
          <CommandPanel panel={commandPanel} onHoverType={setHoveredType} />
        </div>
      </div>

      {openFolderId ? <ArticlesModal folder={articlesData[openFolderId]} onClose={() => setOpenFolderId(null)} /> : null}
      {openVideo ? <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} /> : null}
    </div>
  )
}
