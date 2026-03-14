'use client'

import { useEffect, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  a: number
  drift: number
}

type ShootingStar = {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  length: number
}

export default function PremiumStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    /* Skip canvas animation on mobile — saves battery and GPU */
    if (window.innerWidth < 768) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let animationId = 0

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let stars: Star[] = []

    const shootingStars: ShootingStar[] = Array.from({ length: 3 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      length: 0,
    }))

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      buildScene()
    }

    function buildScene() {
      const starCount = width > 1400 ? 520 : width > 900 ? 420 : 300

      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: rand(0.4, 2.1),
        a: rand(0.24, 0.98),
        drift: rand(0.002, 0.012),
      }))
    }

    function drawStars(t: number) {
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const twinkle =
          0.65 +
          Math.sin(t * (0.0012 + s.drift) + s.x * 0.02 + s.y * 0.018) * 0.35 +
          Math.sin(t * 0.00035 + i * 0.8) * 0.12

        const alpha = Math.max(0.08, s.a * twinkle)
        const driftX = Math.sin(t * s.drift + i) * 0.8
        const driftY = Math.cos(t * s.drift * 0.8 + i) * 0.6

        ctx.beginPath()
        ctx.arc(s.x + driftX, s.y + driftY, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 248, 235, ${alpha})`
        if (width > 1024) {
          ctx.shadowBlur = s.r > 1.4 ? 12 : 6
          ctx.shadowColor = 'rgba(255,255,255,0.28)'
        }
        ctx.fill()
      }

      ctx.shadowBlur = 0
    }

    function maybeSpawnShootingStar() {
      if (prefersReducedMotion) return
      if (Math.random() > 0.035) return

      const available = shootingStars.find((item) => !item.active)
      if (!available) return

      const fromLeft = Math.random() < 0.5
      available.active = true
      available.x = fromLeft ? rand(-120, width * 0.2) : rand(width * 0.8, width + 120)
      available.y = rand(height * 0.04, height * 0.36)
      available.vx = fromLeft ? rand(12, 20) : rand(-20, -12)
      available.vy = rand(4, 8)
      available.life = 0
      available.maxLife = rand(18, 32)
      available.length = rand(140, 260)
    }

    function drawShootingStars() {
      maybeSpawnShootingStar()

      for (const s of shootingStars) {
        if (!s.active) continue

        s.x += s.vx
        s.y += s.vy
        s.life += 1

        const progress = s.life / s.maxLife
        const alpha = Math.max(0, 1 - progress)

        const tailX = s.x - s.vx * (s.length / 10)
        const tailY = s.y - s.vy * (s.length / 10)

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,255,255,${(alpha * 0.95).toFixed(3)})`)
        grad.addColorStop(0.25, `rgba(170,220,255,${(alpha * 0.55).toFixed(3)})`)
        grad.addColorStop(1, 'rgba(170,220,255,0)')

        ctx.strokeStyle = grad
        ctx.lineWidth = 1.8
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.95).toFixed(3)})`
        ctx.fill()

        if (s.life >= s.maxLife) {
          s.active = false
        }
      }
    }

    function draw() {
      frame += prefersReducedMotion ? 6 : 16

      ctx.clearRect(0, 0, width, height)
      drawStars(frame)
      drawShootingStars()

      animationId = window.requestAnimationFrame(draw)
    }

    function handleResize() {
      resize()
    }

    resize()
    draw()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hx-premium-starfield"
      aria-hidden="true"
    />
  )
}