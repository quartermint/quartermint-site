import type { MetadataRoute } from 'next'
import { systems } from '@/lib/systems'

export default function sitemap(): MetadataRoute.Sitemap {
  const systemPages = systems.map((system) => ({
    url: `https://quartermint.com/systems/${system.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    {
      url: 'https://quartermint.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://quartermint.com/invest',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://quartermint.com/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...systemPages,
  ]
}
