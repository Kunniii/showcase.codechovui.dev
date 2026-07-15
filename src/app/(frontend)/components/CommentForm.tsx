'use client'

import React, { useActionState, useEffect, useRef } from 'react'
import { submitComment, FormState } from '../works/[slug]/actions'

interface CommentFormProps {
  workId: string | number
  slug: string
}

const initialState: FormState = { success: false, error: '' }

export default function CommentForm({ workId, slug }: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(submitComment, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset()
    }
  }, [state])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4 mt-6">
      <input type="hidden" name="workId" value={workId.toString()} />
      <input type="hidden" name="slug" value={slug} />

      <div className="relative">
        <textarea
          name="content"
          placeholder="Bạn nghĩ gì về tác phẩm này?"
          required
          rows={3}
          className="w-full bg-surface border border-border-subtle rounded-xl p-4 text-primary font-desc resize-none focus:outline-none focus:ring-2 focus:ring-border-strong transition-all shadow-sm text-lg"
          disabled={isPending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              formRef.current?.requestSubmit()
            }
          }}
        ></textarea>
      </div>

      {state?.error && <p className="text-red-500 text-sm font-medium">{state.error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-canvas px-6 py-2.5 rounded-full text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-canvas"
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
              Đang gửi...
            </>
          ) : (
            <>
              Gửi bình luận
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
