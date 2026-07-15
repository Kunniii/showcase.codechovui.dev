'use client'

import React, { useState, useEffect } from 'react'
import CommentForm from './CommentForm'

interface FloatingCommentsProps {
  comments: any[]
  currentUser: any
  workId: string | number
  slug: string
  loginUrl: string
}

export default function FloatingComments({
  comments,
  currentUser,
  workId,
  slug,
  loginUrl,
}: FloatingCommentsProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Auto open on desktop when component mounts
    if (window.innerWidth >= 640) {
      // Small delay to allow the page to render first, making the slide-in animation visible and smooth
      const timer = setTimeout(() => setIsOpen(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const renderAvatar = (
    type: string | null,
    data: string | null,
    name: string,
    sizeClass = 'w-8 h-8',
  ) => {
    if (type === 'dicebear_svg' && data) {
      return (
        <div
          className={`${sizeClass} rounded-full overflow-hidden bg-surface border border-border-subtle shrink-0 [&>svg]:w-full [&>svg]:h-full`}
          dangerouslySetInnerHTML={{ __html: data }}
        />
      )
    }
    if (type === 'custom' && data) {
      // In a real app we might pass authUrl as a prop, but here we hardcode the production URL as fallback
      const authUrl = 'https://auth.codechovui.dev'
      const imgUrl = data.startsWith('http') ? data : `${authUrl}${data}`
      return (
        <img
          src={imgUrl}
          alt={name}
          className={`${sizeClass} rounded-full object-cover border border-border-subtle shrink-0 bg-surface`}
        />
      )
    }
    // Fallback UI Avatar
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=random&color=fff`
    return (
      <img
        src={fallbackUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border border-border-subtle shrink-0`}
      />
    )
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 bg-primary text-canvas px-5 py-3.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] font-medium tracking-wide flex items-center gap-3 hover:bg-secondary active:scale-[0.98] transition-all duration-300 ${isOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-105'}`}
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
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        Bình luận {comments.length > 0 && `(${comments.length})`}
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
          bottom-0 left-0 right-0 w-full h-[80dvh] max-h-[85vh] rounded-t-[2rem] rounded-b-none border-x-0 border-b-0 origin-bottom
          sm:fixed sm:bottom-24 sm:right-8 sm:left-auto sm:w-[400px] sm:h-[700px] sm:max-h-[calc(100vh-140px)] sm:rounded-2xl sm:border sm:shadow-[0_8px_40px_rgba(0,0,0,0.12)] sm:origin-bottom-right ${
            isOpen
              ? 'translate-y-0 opacity-100 sm:scale-100 sm:opacity-100 sm:translate-y-0'
              : 'translate-y-full opacity-100 pointer-events-none sm:scale-95 sm:opacity-0 sm:translate-y-4 sm:pointer-events-none'
          }`}
      >
        {/* Mobile Swipe handle */}
        <div className="w-12 h-1 bg-border-strong rounded-full mx-auto my-3 shrink-0 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 pt-1 sm:pt-4 border-b border-border-subtle bg-surface/50 rounded-t-2xl shrink-0">
          <h2 className="text-lg font-semibold text-primary">Bình luận</h2>
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

        {/* Comment List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border-strong [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent pr-4">
          {comments.length > 0 ? (
            <div className="flex flex-col gap-0">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="flex gap-3 border-b border-border-subtle py-4 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <div className="shrink-0 pt-0.5">
                    {renderAvatar(comment.userAvatarType, comment.userAvatarData, comment.userName)}
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-primary text-sm">{comment.userName}</span>
                      <span className="text-[10px] text-secondary font-medium tracking-wide uppercase">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-primary font-desc text-[0.95rem] leading-snug whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-secondary opacity-70">
              <svg
                className="w-10 h-10 mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <p className="italic text-xs">
                Chưa có bình luận nào.
                <br />
                Hãy chia sẻ cảm nghĩ của bạn!
              </p>
            </div>
          )}
        </div>

        {/* Action Area */}
        <div className="p-5 border-t border-border-subtle bg-surface rounded-b-2xl shrink-0 pb-safe">
          {currentUser ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                {renderAvatar(
                  currentUser.avatarType,
                  currentUser.avatarData,
                  currentUser.name,
                  'w-6 h-6',
                )}
                <p className="text-[11px] text-secondary flex-1">
                  Bình luận dưới tên{' '}
                  <span className="font-semibold text-primary">
                    {currentUser.name || currentUser.email}
                  </span>
                </p>
                <a
                  href="/logout"
                  className="text-[11px] text-secondary hover:text-red-500 transition-colors underline"
                >
                  Đăng xuất
                </a>
              </div>
              <CommentForm workId={workId} slug={slug} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-center gap-3">
              <p className="text-secondary text-xs">Vui lòng đăng nhập để bình luận</p>
              <a
                href={loginUrl}
                className="inline-flex items-center gap-3 bg-canvas border border-border-strong hover:bg-surface hover:border-primary text-primary px-6 py-3 rounded-full text-sm font-medium transition-all shadow-sm active:scale-[0.98]"
              >
                <img
                  src="https://codechovui.dev/favicon.png"
                  alt="CodeChoVui Logo"
                  className="w-5 h-5 rounded-sm"
                />
                Đăng nhập với CodeChoVui Auth
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
