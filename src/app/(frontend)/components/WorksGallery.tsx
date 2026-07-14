"use client"

import React, { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export type Work = {
  id: string;
  title: string;
  slug?: string;
  category: string;
  creationDate?: string;
  description?: any;
  showcaseImage: any;
  gallery?: any[];
}

interface WorksGalleryProps {
  works: Work[];
}

function useIntersectionObserver(options = {}) {
  const [elements, setElements] = useState<Element[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, ...options });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [elements, options]);

  return setElements;
}

export default function WorksGallery({ works }: WorksGalleryProps) {
  const [filter, setFilter] = useState('All');
  
  const observeElements = useIntersectionObserver();
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const cats = new Set(works.map(w => w.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [works]);

  const filteredWorks = useMemo(() => {
    if (filter === 'All') return works;
    return works.filter(w => w.category === filter);
  }, [filter, works]);

  useEffect(() => {
    if (gridRef.current) {
      const cards = Array.from(gridRef.current.querySelectorAll('.reveal-item'));
      cards.forEach(card => card.classList.remove('visible'));
      
      setTimeout(() => {
        observeElements(cards);
      }, 50);
    }
  }, [filteredWorks, observeElements]);

  return (
    <>
      <div className="flex justify-start gap-3 mb-12 flex-wrap">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`px-5 py-2.5 rounded-full cursor-pointer text-[0.85rem] font-medium tracking-[0.03em] uppercase transition-all duration-200 border ${filter === cat ? 'bg-primary border-primary text-canvas hover:bg-primary/90' : 'bg-canvas border-primary text-primary hover:bg-surface'}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={gridRef}>
        {filteredWorks.map((work, idx) => {
          const imageUrl = work.showcaseImage?.url;
          const imageAlt = work.showcaseImage?.alt || work.title;
          const workUrl = work.slug ? `/works/${work.slug}` : '#';

          return (
            <Link 
              href={workUrl}
              key={work.id} 
              className="bg-surface border border-border-subtle rounded-lg overflow-hidden relative cursor-pointer flex flex-col transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] active:scale-[0.98] reveal-item group" 
              style={{ transitionDelay: `${(idx % 6) * 50}ms` }}
            >
              <div className="relative w-full aspect-[4/3] bg-[#f0f0f0] overflow-hidden border-b border-border-subtle">
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt={imageAlt} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                    priority={idx < 6}
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-base font-medium mb-1 transition-colors group-hover:text-accent-text">{work.title}</h3>
                <span className="text-xs text-secondary uppercase tracking-wider">{work.category}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
