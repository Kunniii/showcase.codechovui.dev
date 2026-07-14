import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Mình là ai? - Showcase',
  description: 'Góc nhỏ chia sẻ về bản thân.',
}

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })
  const about = await payload.findGlobal({ slug: 'about' })

  // Use the title from the CMS or default
  const titleText = about?.title || 'Ủa mình là ai ta?'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 min-h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        .about-richtext p {
          margin-bottom: 1.5rem;
        }
        .about-richtext strong {
          color: var(--color-primary);
          font-weight: 500;
          border-bottom: 2px dashed rgb(from var(--color-primary) r g b / 0.3);
        }
      `}} />

      <header className="pt-16 pb-8 sm:pt-24 sm:pb-8">
        <Link 
          href="/" 
          className="text-secondary hover:text-primary transition-colors text-[0.85rem] font-medium tracking-[0.05em] uppercase flex items-center gap-2 w-fit mb-8 sm:mb-12 group"
        >
          <svg className="group-hover:-translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Chạy về nhà
        </Link>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary mb-4 group w-fit cursor-help">
          {titleText} <span className="inline-block group-hover:rotate-12 transition-transform origin-bottom-right">🤔</span>
        </h1>
      </header>

      <main className="about-richtext flex-1 font-desc text-primary/90 text-base sm:text-lg leading-relaxed">
        {about?.content ? (
          <RichText data={about.content} />
        ) : (
          <p>Nội dung đang được cập nhật...</p>
        )}
      </main>

      <footer className="text-left py-16 text-secondary text-[0.85rem] border-t border-border-subtle mt-16 sm:mt-24">
        <p>&copy; {new Date().getFullYear()} <a href="https://codechovui.dev" className='text-primary font-semibold hover:underline transition-colors' target='blank'>CodeChoVui</a>. All rights reserved.</p>
      </footer>
    </div>
  )
}
