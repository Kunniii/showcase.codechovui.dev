'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import FloatingExif from './FloatingExif'

interface ImageLightboxProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  exif?:
    | {
        camera?: string | null
        lens?: string | null
        aperture?: string | null
        shutterSpeed?: string | null
        iso?: string | null
        focalLength?: string | null
      }
    | null
    | undefined
}

export default function ImageLightbox({
  src,
  alt,
  width,
  height,
  priority = false,
  exif,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const [isLoaded, setIsLoaded] = useState(false)
  const hasDragged = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle native wheel event to reliably prevent default scrolling behavior
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      setScale((prev) => {
        // Reverse direction for natural scrolling feel
        const delta = e.deltaY * -0.005
        const newScale = prev + delta
        return Math.min(Math.max(1, newScale), 5) // Limit zoom between 1x and 5x
      })
    }

    if (isOpen) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [isOpen])

  const handlePointerDown = (e: React.PointerEvent) => {
    hasDragged.current = false
    if (scale > 1) {
      setIsDragging(true)
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
      // Capture pointer to track outside window bounds
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && scale > 1) {
      hasDragged.current = true
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScale(1)
       
      setPosition({ x: 0, y: 0 })
      hasDragged.current = false
      // Intentionally not resetting isLoaded here so if they reopen, it might be cached
    }
  }, [isOpen])

  return (
    <>
      <div className="cursor-zoom-in w-full h-full relative group" onClick={() => setIsOpen(true)}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-95"
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 1200px"
          quality={75} // Preview quality
        />
        <div className="absolute top-4 right-4 bg-canvas/80 backdrop-blur text-primary px-3 py-1.5 rounded-full text-xs font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none flex items-center gap-1 shadow-sm">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          Phóng to
        </div>
      </div>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-canvas/98 backdrop-blur-md flex items-center justify-center touch-none animate-in fade-in duration-300"
            onClick={() => {
              if (!hasDragged.current) {
                setIsOpen(false)
              }
            }}
          >
            <button
              className="absolute top-6 right-6 z-[110] bg-surface/50 backdrop-blur border border-border-subtle text-primary p-3 rounded-full cursor-pointer hover:bg-surface hover:scale-105 transition-all shadow-sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-surface/80 backdrop-blur border border-border-subtle text-secondary px-4 py-2 rounded-full text-xs font-medium hidden sm:flex items-center gap-4 shadow-sm pointer-events-none">
              <span className="flex items-center gap-1">
                <kbd className="font-sans border border-border-strong rounded px-1 text-[10px]">
                  ESC
                </kbd>{' '}
                Đóng
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-sans border border-border-strong rounded px-1 text-[10px]">
                  SCROLL
                </kbd>{' '}
                Thu phóng
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-sans border border-border-strong rounded px-1 text-[10px]">
                  DRAG
                </kbd>{' '}
                Di chuyển
              </span>
            </div>

            {/* Loading Indicator for slow networks */}
            {!isLoaded && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[105] text-secondary/50 flex flex-col items-center gap-2 pointer-events-none">
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-xs uppercase tracking-wider">Loading Full Size</span>
              </div>
            )}

            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center overflow-hidden"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className="relative transition-transform ease-out will-change-transform"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                  width: '90vw',
                  height: '90vh',
                  transitionDuration: isDragging ? '0ms' : '150ms',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!hasDragged.current) {
                    if (scale === 1) {
                      setScale(2) // Click to zoom as alternative
                    }
                  }
                  setTimeout(() => {
                    hasDragged.current = false
                  }, 0)
                }}
              >
                {/* Cached Low Res Placeholder */}
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={`object-contain pointer-events-none transition-opacity duration-500 blur-xl scale-105 ${isLoaded ? 'opacity-0' : 'opacity-40'}`}
                  quality={75}
                  sizes="(max-width: 1024px) 100vw, 1200px"
                />

                {/* High Res Image */}
                <Image
                  src={src}
                  alt={alt}
                  fill
                  unoptimized
                  className={`object-contain pointer-events-none transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  priority
                  onLoad={() => setIsLoaded(true)}
                />
              </div>
            </div>

            {/* EXIF floating widget, stops propagation so clicking it doesn't close the lightbox */}
            {exif && (
              <div onClick={(e) => e.stopPropagation()}>
                <FloatingExif exif={exif} />
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}
