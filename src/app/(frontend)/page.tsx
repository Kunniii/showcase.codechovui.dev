import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import WorksGallery from './components/WorksGallery'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const { docs: works } = await payload.find({
    collection: 'works',
    depth: 1,
    limit: 100,
  })

  const mappedWorks = works.map((work) => ({
    id: work.id,
    title: work.title,
    slug: work.slug,
    category: work.category,
    creationDate: work.creationDate,
    description: work.description,
    showcaseImage: work.showcaseImage,
    gallery: work.gallery,
  }))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8">
      <header className="pt-20 pb-16 sm:pt-32 sm:pb-24 text-left max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-base sm:text-[1.25rem] leading-[1.8] sm:leading-[1.9] text-primary font-desc font-normal tracking-wide">
          Hé lô! Mình chỉ là một
          <span className="inline-grid align-middle mx-2 sm:mx-2 group cursor-pointer select-none translate-y-[-1px] sm:translate-y-[-2px]">
            <span className="font-christmas font-bold text-3xl sm:text-4xl origin-left transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-12 group-hover:scale-50 group-hover:opacity-0 group-hover:translate-y-2 col-start-1 row-start-1 text-primary">
              Ng&apos;bthg
            </span>
            <span className="font-sans font-semibold text-xl sm:text-2xl origin-left transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] -rotate-12 scale-50 opacity-0 -translate-y-2 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 text-primary col-start-1 row-start-1 whitespace-nowrap">
              người bình thường
            </span>
          </span>
          <br className="hidden sm:block" />
          <span>
            Mình siêu thích nghe nhạc, lang thang chụp ảnh random, gõ code vjp pro, overthinking,
            viết lách bậy bạ và nghịch đất trồng cây. Chỗ này là cái{' '}
            <span className="relative group/secret cursor-help font-medium text-primary border-b-2 border-primary/30 border-dashed">
              &quot;kho bí mật&quot;
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-primary text-canvas text-[0.85rem] font-sans font-medium rounded-xl opacity-0 translate-y-3 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/secret:opacity-100 group-hover/secret:translate-y-0 shadow-xl z-10">
                well, cũng không bí mật lắm 🤫
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-primary"></span>
              </span>
            </span>{' '}
            để mình cất giấu mấy trò nghịch ngợm linh tinh với hình ảnh đó! Nếu bạn tò mò{' '}
            <a
              href="/about"
              className="text-primary hover:text-secondary transition-colors border-b border-primary/20 hover:border-transparent pb-0.5 whitespace-nowrap"
            >
              câu chuyện của mình
            </a>
            , hay rủ rê chém gió qua
            <span className="inline-flex items-center gap-2 mx-2 align-middle translate-y-[-1px]">
              <a
                href="https://github.com/Kunniii"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-transform hover:scale-110"
                aria-label="GitHub"
              >
                <svg
                  className="w-5 h-5 sm:w-[1.2rem] sm:h-[1.2rem]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/n.phi.truong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 sm:w-[1.2rem] sm:h-[1.2rem]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/Nguyen.PhiTruong.5801"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 sm:w-[1.2rem] sm:h-[1.2rem]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </span>
            thì cứ nhào vô tự nhiên nhennn!
          </span>
        </h1>
      </header>

      <WorksGallery works={mappedWorks as any} />

      <footer className="text-left py-16 text-secondary text-[0.85rem] border-t border-border-subtle mt-16">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <a
            href="https://codechovui.dev"
            className="text-primary font-semibold hover:underline transition-colors"
            target="blank"
          >
            CodeChoVui
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  )
}
