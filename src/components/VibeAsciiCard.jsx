import { useEffect, useRef } from 'react'

export default function VibeAsciiCard() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    host.style.position = 'absolute'
    host.style.inset = '0'
    host.style.height = '100%'
    host.style.zIndex = '0'
    host.style.pointerEvents = 'none'
    host.style.overflow = 'hidden'

    host.innerHTML =
      '<div data-ascii-dither-bg aria-hidden="true" style="position:absolute;inset:0;height:100%;z-index:0;pointer-events:none;overflow:hidden"></div>'

    const script = document.createElement('script')
    script.src = `${import.meta.env.BASE_URL}ascii-dither-background.js?v=push-3`
    script.async = true
    host.appendChild(script)

    return () => {
      const mount = host.querySelector('[data-ascii-dither-bg]')
      if (mount && typeof mount.__asciiDitherDestroy === 'function') {
        mount.__asciiDitherDestroy()
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      host.innerHTML = ''
    }
  }, [])

  return (
    <div ref={hostRef} className="vibe-ascii-card" aria-hidden="true" />
  )
}
