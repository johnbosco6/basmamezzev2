"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"

export function SiteBorderBeam() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null)
  const [progress, setProgress] = useState(0) // 0 to 1
  const [isFading, setIsFading] = useState(false)
  const [opacity, setOpacity] = useState(1)

  const pathRef = useRef<SVGPathElement | null>(null)
  const totalLengthRef = useRef<number>(0)
  const [headPos, setHeadPos] = useState<{ x: number; y: number } | null>(null)

  // Don't show in admin dashboard or studio
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/studio")

  useEffect(() => {
    if (isAdmin) return

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const updateDimensions = () => {
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight,
      })
    }

    updateDimensions()
    setIsMounted(true)

    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [isAdmin])

  useEffect(() => {
    if (!dimensions || !pathRef.current) return

    const path = pathRef.current
    const length = path.getTotalLength()
    totalLengthRef.current = length

    const startTime = performance.now()
    const DURATION = 1800 // 1.8s for the full loop around the screen display
    const FADE_DELAY = 200 // pause briefly once closed
    const FADE_DURATION = 600 // 600ms smooth fade out

    let animationFrameId: number

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime

      if (elapsed < DURATION) {
        // Easing function: smooth acceleration and deceleration
        const linearT = elapsed / DURATION
        // Smooth cubic ease-in-out
        const easedT =
          linearT < 0.5
            ? 4 * linearT * linearT * linearT
            : 1 - Math.pow(-2 * linearT + 2, 3) / 2

        setProgress(easedT)

        const currentDist = easedT * length
        if (path) {
          const point = path.getPointAtLength(currentDist)
          setHeadPos({ x: point.x, y: point.y })
        }

        animationFrameId = requestAnimationFrame(animate)
      } else if (elapsed < DURATION + FADE_DELAY) {
        setProgress(1)
        setHeadPos(null)
        animationFrameId = requestAnimationFrame(animate)
      } else if (elapsed < DURATION + FADE_DELAY + FADE_DURATION) {
        setIsFading(true)
        const fadeElapsed = elapsed - (DURATION + FADE_DELAY)
        const fadeRatio = 1 - fadeElapsed / FADE_DURATION
        setOpacity(Math.max(0, fadeRatio))
        animationFrameId = requestAnimationFrame(animate)
      } else {
        // Done: remove from DOM
        setOpacity(0)
        setIsMounted(false)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions])

  if (!isMounted || !dimensions || isAdmin) {
    return null
  }

  const { w, h } = dimensions
  // Offset by 1px so strokeWidth 2 is fully visible without clipping
  const inset = 1
  const startX = Math.round(w / 2)
  const startY = inset
  const rightX = w - inset
  const bottomY = h - inset
  const leftX = inset

  // Path starts at top center, traces clockwise around the entire screen display, and returns to top center
  const pathData = `M ${startX} ${startY} H ${rightX} V ${bottomY} H ${leftX} V ${startY} H ${startX}`

  const strokeDashoffset =
    totalLengthRef.current > 0
      ? totalLengthRef.current * (1 - progress)
      : undefined

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 999999,
        opacity: opacity,
        transition: isFading ? "none" : undefined,
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-full block"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Website gradient: Basma Gold (#BA9D76) -> Champagne (#F3E3B6) -> Mediterranean Blue (#597FB1) -> Deep Sapphire (#326096) */}
          <linearGradient
            id="basma-border-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#BA9D76" />
            <stop offset="25%" stopColor="#F5DDA9" />
            <stop offset="50%" stopColor="#597FB1" />
            <stop offset="75%" stopColor="#326096" />
            <stop offset="100%" stopColor="#BA9D76" />
          </linearGradient>

          {/* Delicate bloom filter */}
          <filter id="border-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ambient glow path */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#basma-border-gradient)"
          strokeWidth="4.5"
          strokeDasharray={totalLengthRef.current || 10000}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeLinejoin="miter"
          opacity="0.45"
          filter="url(#border-glow-filter)"
        />

        {/* Ultra-crisp thin core line */}
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="url(#basma-border-gradient)"
          strokeWidth="1.75"
          strokeDasharray={totalLengthRef.current || 10000}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeLinejoin="miter"
        />

        {/* Glowing comet head traveling at the tip of the line */}
        {headPos && (
          <g transform={`translate(${headPos.x}, ${headPos.y})`}>
            {/* Outer halo */}
            <circle
              r="7"
              fill="#F5DDA9"
              opacity="0.4"
              style={{ filter: "blur(2px)" }}
            />
            {/* Middle golden glow */}
            <circle
              r="4"
              fill="#BA9D76"
              opacity="0.8"
            />
            {/* Bright white-hot center core */}
            <circle
              r="2"
              fill="#FFFFFF"
            />
          </g>
        )}
      </svg>
    </div>
  )
}
