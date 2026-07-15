'use client'

import React, { useState } from 'react'

interface FloatingExifProps {
  exif:
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

export default function FloatingExif({ exif }: FloatingExifProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Auto-open with entrance animation after a slight delay, ONLY on desktop
  React.useEffect(() => {
    if (window.innerWidth >= 640) {
      const timer = setTimeout(() => setIsOpen(true), 300)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!exif) return null

  // Check if there is at least one EXIF value filled
  const hasExifData = Object.values(exif).some((val) => val && val.trim() !== '')
  if (!hasExifData) return null

  const items = [
    {
      label: 'Máy ảnh',
      value: exif.camera,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      ),
    },
    {
      label: 'Ống kính',
      value: exif.lens,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
    },
    {
      label: 'Khẩu độ',
      value: exif.aperture,
      icon: (
        <span className="text-secondary font-mono text-[15px] font-semibold select-none leading-none w-[18px] text-center">
          ƒ
        </span>
      ),
    },
    {
      label: 'Tốc độ',
      value: exif.shutterSpeed,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      label: 'ISO',
      value: exif.iso,
      icon: (
        <span className="text-secondary font-mono text-[10px] font-bold tracking-tight select-none leading-none w-[18px] text-center">
          ISO
        </span>
      ),
    },
    {
      label: 'Tiêu cự',
      value: exif.focalLength,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-secondary"
        >
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="12" y1="2" x2="12" y2="22"></line>
        </svg>
      ),
    },
  ].filter((item) => item.value && item.value.trim() !== '')

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8 sm:left-8 sm:translate-x-0 z-40 bg-surface border border-border-strong text-primary px-5 py-3.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] font-medium tracking-wide flex items-center gap-3 hover:border-primary active:scale-[0.98] transition-all duration-300 ${isOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-105'}`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
        <span>Thông số</span>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Box / Bottom Sheet Panel */}
      <div
        className={`fixed z-50 bg-canvas/95 backdrop-blur-xl border border-border-strong flex flex-col transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          bottom-0 left-0 right-0 w-full h-auto max-h-[80vh] rounded-t-[2rem] rounded-b-none border-x-0 border-b-0 origin-bottom
          sm:fixed sm:bottom-24 sm:left-8 sm:right-auto sm:w-[350px] sm:h-auto sm:rounded-2xl sm:border sm:shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:origin-bottom-left ${
            isOpen
              ? 'translate-y-0 opacity-100 sm:scale-100 sm:opacity-100 sm:translate-y-0'
              : 'translate-y-full opacity-100 pointer-events-none sm:scale-95 sm:opacity-0 sm:translate-y-4 sm:pointer-events-none'
          }`}
      >
        {/* Mobile Swipe handle */}
        <div className="w-12 h-1 bg-border-strong rounded-full mx-auto my-3 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 pt-1 sm:pt-4 border-b border-border-subtle bg-surface/50 rounded-t-2xl shrink-0">
          <h2 className="text-lg font-semibold text-primary">Thông số EXIF</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-secondary hover:text-primary hover:bg-surface rounded-full transition-colors"
          >
            <svg
              width="18"
              height="18"
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
        </div>

        {/* EXIF Data Rows */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[60vh] pb-8 sm:pb-6 pb-safe">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-border-subtle last:border-b-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface border border-border-subtle flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <span className="text-secondary text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-primary font-desc text-right text-[1rem] font-semibold ml-4">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
