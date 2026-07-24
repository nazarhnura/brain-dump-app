import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const BALL_SIZE = 56
const FRICTION_PER_SEC = 0.55
const STOP_SPEED = 20
const FLICK_MULTIPLIER = 1.4
const FLICK_MIN_SPEED = 80

interface BallState {
  x: number
  y: number
  vx: number
  vy: number
  dragging: boolean
  flying: boolean
  scored: boolean
  settling: boolean
  samples: { x: number; y: number; t: number }[]
}

export function Game() {
  const screenRef = useRef<HTMLDivElement>(null)
  const goalRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const [score, setScore] = useLocalStorage('game-score', 0)
  const [flash, setFlash] = useState(false)

  const stateRef = useRef<BallState>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    dragging: false,
    flying: false,
    scored: false,
    settling: false,
    samples: [],
  })

  const resetBall = () => {
    const screen = screenRef.current
    const ball = ballRef.current
    if (!screen || !ball) return
    const width = screen.clientWidth
    const height = screen.clientHeight
    const s = stateRef.current
    s.x = width / 2 - BALL_SIZE / 2
    s.y = height - BALL_SIZE - 32
    s.vx = 0
    s.vy = 0
    s.flying = false
    s.scored = false
    s.settling = false
    ball.style.transition = ''
    ball.style.opacity = '1'
    ball.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`
  }

  useEffect(() => {
    resetBall()
    const handleResize = () => {
      const s = stateRef.current
      if (!s.flying && !s.dragging) resetBall()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let frameId: number
    let lastTime = performance.now()

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      const s = stateRef.current
      const screen = screenRef.current
      const ball = ballRef.current
      const goal = goalRef.current

      if (s.flying && screen && ball && goal) {
        s.x += s.vx * dt
        s.y += s.vy * dt

        const width = screen.clientWidth
        const maxX = width - BALL_SIZE

        if (s.x <= 0) {
          s.x = 0
          s.vx = Math.abs(s.vx) * 0.6
        } else if (s.x >= maxX) {
          s.x = maxX
          s.vx = -Math.abs(s.vx) * 0.6
        }

        const screenRect = screen.getBoundingClientRect()
        const goalRect = goal.getBoundingClientRect()
        const goalLeft = goalRect.left - screenRect.left
        const goalRight = goalRect.right - screenRect.left
        const goalBottom = goalRect.bottom - screenRect.top
        const ballCenterX = s.x + BALL_SIZE / 2

        if (
          !s.scored &&
          s.y <= goalBottom &&
          ballCenterX > goalLeft + 10 &&
          ballCenterX < goalRight - 10
        ) {
          s.scored = true
          s.flying = false
          setScore((prev) => prev + 1)
          setFlash(true)
          ball.style.transition = 'transform 0.25s ease, opacity 0.25s ease'
          ball.style.opacity = '0'
          setTimeout(() => {
            setFlash(false)
            resetBall()
          }, 650)
        } else if (s.y <= 0) {
          s.y = 0
          s.vy = Math.abs(s.vy) * 0.5
        }

        const frictionFactor = Math.pow(FRICTION_PER_SEC, dt)
        s.vx *= frictionFactor
        s.vy *= frictionFactor

        if (!s.scored) {
          ball.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`

          const speed = Math.hypot(s.vx, s.vy)
          if (speed < STOP_SPEED && !s.settling) {
            s.flying = false
            s.settling = true
            setTimeout(() => {
              if (!stateRef.current.dragging) resetBall()
            }, 500)
          }
        }
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [setScore])

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const ball = ballRef.current
    if (!ball) return
    const s = stateRef.current
    s.dragging = true
    s.flying = false
    s.settling = false
    ball.setPointerCapture(e.pointerId)
    s.samples = [{ x: e.clientX, y: e.clientY, t: performance.now() }]
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = stateRef.current
    if (!s.dragging) return
    const screen = screenRef.current
    const ball = ballRef.current
    if (!screen || !ball) return
    const screenRect = screen.getBoundingClientRect()
    s.x = e.clientX - screenRect.left - BALL_SIZE / 2
    s.y = e.clientY - screenRect.top - BALL_SIZE / 2
    ball.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`
    s.samples.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    if (s.samples.length > 6) s.samples.shift()
  }

  const handlePointerUp = () => {
    const s = stateRef.current
    if (!s.dragging) return
    s.dragging = false

    const samples = s.samples
    if (samples.length >= 2) {
      const first = samples[0]
      const last = samples[samples.length - 1]
      const dt = Math.max((last.t - first.t) / 1000, 0.016)
      const vx = ((last.x - first.x) / dt) * FLICK_MULTIPLIER
      const vy = ((last.y - first.y) / dt) * FLICK_MULTIPLIER
      const speed = Math.hypot(vx, vy)
      if (speed > FLICK_MIN_SPEED) {
        s.vx = vx
        s.vy = vy
        s.flying = true
        s.settling = false
      } else {
        resetBall()
      }
    } else {
      resetBall()
    }
  }

  return (
    <div className="screen game-screen" ref={screenRef}>
      <h1 className="screen__title">Game</h1>
      <p className="game-score">⚽ Голів: {score}</p>
      <div className="game-goal" ref={goalRef}>
        <div className="game-goal__net" />
      </div>
      {flash && <div className="game-goal-flash">ГОЛ!</div>}
      <div
        ref={ballRef}
        className="game-ball"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        ⚽
      </div>
    </div>
  )
}
