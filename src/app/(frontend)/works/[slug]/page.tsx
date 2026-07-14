import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ImageLightbox from '../../components/ImageLightbox'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cookies } from 'next/headers'
import FloatingComments from '../../components/FloatingComments'

export const dynamic = 'force-dynamic'

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'works',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 1,
  })

  if (!docs.length) {
    return notFound()
  }

  const work = docs[0]
  const imageUrl = (work.showcaseImage as any)?.url
  const imageAlt = (work.showcaseImage as any)?.alt || work.title
  
  const gallery = work.gallery || []

  // --- AUTH & COMMENTS LOGIC ---
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  let currentUser = null
  if (token) {
    try {
      const authUrl = process.env.CODECHOVUI_AUTH_URL || 'https://auth.codechovui.dev'
      const userRes = await fetch(`${authUrl}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      })
      
      if (userRes.ok) {
        const userData = await userRes.json()
        currentUser = {
          name: userData.user?.profile?.display_name || userData.user?.username || 'Anonymous User',
          email: userData.user?.profile?.email || 'Anonymous',
          avatarType: userData.user?.profile?.avatar_type || null,
          avatarData: userData.user?.profile?.avatar_data || null,
        }
      } else {
        console.warn('Invalid token, user is not logged in.')
      }
    } catch (e) {
      console.error('Error verifying token on page load:', e)
    }
  }

  // Fetch comments for this work
  const commentsResult = await payload.find({
    collection: 'comments',
    where: {
      work: {
        equals: work.id,
      },
    },
    sort: '-createdAt', // Newest first
    depth: 0,
  })
  const comments = commentsResult.docs

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 min-h-screen">
      <header className="mb-12">
        <Link 
          href="/" 
          className="text-secondary hover:text-primary transition-colors text-[0.85rem] font-medium tracking-[0.05em] uppercase flex items-center gap-2 w-fit mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Quay lại Gallery
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-primary mb-4">{work.title}</h1>
        
        <div className="flex gap-4 text-secondary text-[0.85rem] uppercase tracking-[0.05em]">
          <span>{work.category}</span>
          {work.creationDate && <span>{new Date(work.creationDate).getFullYear()}</span>}
        </div>
      </header>

      <main>
        {imageUrl && (
          <div className="w-full relative mb-12 sm:mb-16 bg-surface border border-border-subtle rounded-xl overflow-hidden shadow-sm">
            <ImageLightbox 
              src={imageUrl} 
              alt={imageAlt} 
              width={(work.showcaseImage as any)?.width || 1200}
              height={(work.showcaseImage as any)?.height || 800}
              priority={true}
              exif={(work.showcaseImage as any)?.exif}
            />
          </div>
        )}

        {work.description && (
          <div className="font-desc text-primary text-lg sm:text-xl leading-relaxed max-w-[65ch] mx-auto mb-12 sm:mb-16 prose prose-neutral">
            <RichText data={work.description} />
          </div>
        )}

        {gallery.length > 0 && (
          <div className="columns-1 sm:columns-2 gap-8 sm:gap-10 mb-16 sm:mb-24 mt-8">
            {gallery.map((mediaItem: any, i: number) => {
              const gImageUrl = mediaItem?.url
              const gImageAlt = mediaItem?.alt || `${work.title} gallery image ${i + 1}`
              
              if (!gImageUrl) return null

              // Random rotation between 5 and 15 degrees, randomly positive or negative
              const randDegree = Math.random() * 10 + 5
              const sign = Math.random() > 0.5 ? 1 : -1
              const deg = (randDegree * sign).toFixed(2)
              
              return (
                <div 
                  key={mediaItem.id || i} 
                  style={{ '--random-rot': `${deg}deg` } as React.CSSProperties}
                  className="break-inside-avoid mb-10 sm:mb-12 w-full relative bg-surface border-4 sm:border-8 border-white rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center [transform:rotate(var(--random-rot))] hover:[transform:rotate(0deg)_translateY(-8px)_scale(1.03)]"
                >
                  <ImageLightbox 
                    src={gImageUrl} 
                    alt={gImageAlt} 
                    width={mediaItem.width || 1200}
                    height={mediaItem.height || 800}
                    exif={mediaItem?.exif}
                  />
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="text-left py-16 text-secondary text-[0.85rem] border-t border-border-subtle mt-16 sm:mt-24">
        <p>&copy; {new Date().getFullYear()} <a href="https://codechovui.dev" className='text-primary font-semibold hover:underline transition-colors' target='blank'>CodeChoVui</a>. All rights reserved.</p>
      </footer>

      {/* FLOATING COMMENTS WIDGET */}
      <FloatingComments 
        comments={comments} 
        currentUser={currentUser} 
        workId={work.id} 
        slug={slug} 
        loginUrl={`${process.env.CODECHOVUI_AUTH_URL || 'https://auth.codechovui.dev'}/authorize?client_id=${process.env.CODECHOVUI_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/callback&state=/works/${slug}`}
      />
    </div>
  )
}
