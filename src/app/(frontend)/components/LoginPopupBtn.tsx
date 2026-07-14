'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPopupBtn() {
  const router = useRouter()

  const handleLogin = () => {
    const width = 400;
    const height = 650;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    
    // Construct the redirect URL to our close-popup page
    const redirectUrl = encodeURIComponent(`${window.location.origin}/close-popup`);
    
    // Open the auth server login page in a popup
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://auth.codechovui.dev';
    const popup = window.open(
      `${authUrl}/login?redirect=${redirectUrl}`, 
      'CodeChoVuiLogin',
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    // Poll to check when popup is closed (either by user or by our close-popup script)
    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        // Refresh the page to pick up the new auth_token cookie
        router.refresh();
      }
    }, 500);
  }

  return (
    <button 
      onClick={handleLogin}
      className="inline-flex items-center gap-3 bg-canvas border border-border-strong hover:bg-surface hover:border-primary text-primary px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
    >
      <img src="https://codechovui.dev/favicon.png" alt="CodeChoVui Logo" className="w-5 h-5 rounded-sm" />
      Đăng nhập với CodeChoVui Auth
    </button>
  )
}
