import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  
  const { docs: works } = await payload.find({
    collection: 'works',
    depth: 0,
    limit: 1000,
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://showcase.codechovui.dev'

  const workRoutes = works.map((work) => ({
    url: `${baseUrl}/works/${work.slug}`,
    lastModified: work.updatedAt ? new Date(work.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...workRoutes,
  ]
}
