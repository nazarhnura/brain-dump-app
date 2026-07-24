import { useEffect, useRef } from 'react'

interface BouncingBallProps {
  children: React.ReactNode
  size?: number
  speed?: number
  className?: string
}

export function BouncingBall({ children, size = 36, speed = 90, className }: BouncingBallProps) {
  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = elRef.current
    const parent = el?.parentElement
    if (!el || !parent) return

    let width = parent.clientWidth
    let height = parent.clientHeight

    let x = Math.random() * Math.max(width - size, 1)
    let y = Math.random() * Math.max(height - size, 1)
    const angle = Math.random() * Math.PI * 2
    let vx = Math.cos(angle) * speed
    let vy = Math.sin(angle) * speed
    let rotation = 0
    let lastTime = performance.now()
    let frameId: number

    const handleResize = () => {
      width = parent.clientWidth
      height = parent.clientHeight
    }
    window.addEventListener('resize', handleResize)

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time

      x += vx * dt
      y += vy * dt

      const maxX = Math.max(width - size, 0)
      const maxY = Math.max(height - size, 0)

      if (x <= 0) {
        x = 0
        vx = Math.abs(vx)
      } else if (x >= maxX) {
        x = maxX
        vx = -Math.abs(vx)
      }

      if (y <= 0) {
        y = 0
        vy = Math.abs(vy)
      } else if (y >= maxY) {
        y = maxY
        vy = -Math.abs(vy)
      }

      rotation += (Math.abs(vx) + Math.abs(vy)) * dt * 0.6
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [size, speed])

  return (
    <span
      ref={elRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.85,
        lineHeight: 1,
        willChange: 'transform',
      }}
    >
      {children}
    </span>
  )
}
