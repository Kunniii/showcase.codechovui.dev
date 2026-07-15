'use client'

import React, { useEffect } from 'react'

export default function ClosePopup() {
  useEffect(() => {
    // If opened as a popup, close it immediately
    if (window.opener) {
      window.close()
    } else {
      // Fallback if not a popup, just redirect to home
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-canvas">
      <p className="text-secondary font-medium">Đăng nhập thành công, đang đóng cửa sổ...</p>
    </div>
  )
}
