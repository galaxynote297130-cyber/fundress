import { POSES } from '~/utils/poses'

export default defineEventHandler((event) => {
  const site = (useRuntimeConfig().public.siteUrl || 'https://fundress.pages.dev').replace(/\/$/, '')
  const now = new Date().toISOString().slice(0, 10)

  const urls = [
    { loc: '/', p: '1.0' },
    { loc: '/edition', p: '0.9' },
    { loc: '/video', p: '0.9' },
    ...POSES.map(x => ({ loc: `/pose/${x.id}`, p: '0.7' })),
    { loc: '/galerie', p: '0.4' },
    { loc: '/cgu', p: '0.3' },
    { loc: '/confidentialite', p: '0.3' },
    { loc: '/mentions-legales', p: '0.3' },
  ]

  const body = urls
    .map(u => `<url><loc>${site}${u.loc}</loc><lastmod>${now}</lastmod><priority>${u.p}</priority></url>`)
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`
})
