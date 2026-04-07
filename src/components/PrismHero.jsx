import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

const float PI = 3.14159265359;

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float sdHexagon(vec2 p, float r) {
  const vec3 k = vec3(-0.8660254, 0.5, 0.5773503);
  p = abs(p);
  p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
  p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
  return length(p) * sign(p.y);
}

vec3 spectrum(float t) {
  return 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.17, 0.4) + t));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  float time = uTime * 0.1167;
  vec2 prismUv = rotate2d(time * 0.4) * uv;
  float radius = length(prismUv);
  float angle = atan(prismUv.y, prismUv.x);

  float hex = sdHexagon(prismUv, 0.34);
  float prismCore = smoothstep(0.1, -0.08, hex);
  float prismRim = smoothstep(0.05, 0.0, abs(sdHexagon(prismUv, 0.48)));

  float rays = pow(max(0.0, cos(angle * 3.0 - time * 1.8)), 10.0);
  rays *= smoothstep(1.25, 0.18, radius);

  float shimmer = pow(max(0.0, cos(angle * 6.0 + radius * 12.0 - time * 2.4)), 5.0);
  shimmer *= exp(-radius * 2.1);

  float halo = smoothstep(1.05, 0.0, radius);

  vec3 rayColor = spectrum(angle / (2.0 * PI) - time * 0.05 + radius * 0.12);
  vec3 shimmerColor = spectrum(radius * 0.25 + time * 0.08 + 0.2);
  vec3 glassColor = mix(vec3(0.96, 0.99, 1.0), spectrum(angle / (2.0 * PI) + 0.15), 0.45);

  vec3 color = vec3(0.0);
  color += rayColor * rays * 1.1;
  color += shimmerColor * shimmer * 0.9;
  color += glassColor * prismCore * 0.95;
  color += spectrum(angle / (2.0 * PI) + 0.35) * prismRim * 0.8;
  color += vec3(0.4, 0.56, 0.95) * halo * 0.08;

  float alpha = prismCore * 0.8 + prismRim * 0.55 + rays * 0.42 + shimmer * 0.22;
  alpha *= smoothstep(1.15, 0.08, radius);

  gl_FragColor = vec4(color, alpha);
}
`

export default function PrismHero() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    gl.canvas.className = 'prism-hero__canvas'
    container.appendChild(gl.canvas)

    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = [width, height]
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()

    let frameId = 0
    const render = (time) => {
      program.uniforms.uTime.value = time * 0.001
      renderer.render({ scene: mesh })
      frameId = window.requestAnimationFrame(render)
    }

    frameId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas)
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <div ref={containerRef} className="prism-hero" aria-hidden="true" />
}
