import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.ARVOW_WEBHOOK_SECRET
    if (expectedSecret) {
      const headers = [
        request.headers.get('x-secret'),
        request.headers.get('x-arvow-secret'),
        request.headers.get('x-webhook-secret'),
        request.headers.get('authorization')?.replace('Bearer ', ''),
        request.nextUrl.searchParams.get('secret'),
      ]
      const isValid = headers.some(h => h === expectedSecret)
      if (!isValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await request.json()
    const article = body.article || body.data || body
    if (!article) {
      return NextResponse.json({ error: 'No article data' }, { status: 400 })
    }

    const title = article.title || article.h1 || 'Untitled'
    const rawContent = article.content || article.html || article.body || ''

    // Strip competitor links and unwanted external domains
    // Keep links to: portal.cottenfirm.com, blog.cottenfirm.com, cottenfirm.com, ncleg.gov, nccourts.gov, ncleg.net
    const COMPETITOR_DOMAINS = [
      'iticket.law', 'iticket.com',
      'lawyers.findlaw.com', 'findlaw.com',
      'avvo.com', 'martindale.com', 'lawinfo.com',
      'justia.com', 'nolo.com',
    ]
    const KEEP_DOMAINS = [
      'cottenfirm.com', 'portal.cottenfirm.com', 'blog.cottenfirm.com',
      'ncleg.gov', 'ncleg.net', 'nccourts.gov', 'ncdot.gov',
    ]

    const content = rawContent.replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (match: string, href: string, text: string) => {
      // Keep if it's a relative link or an approved domain
      if (!href.startsWith('http')) return match
      const isKeep = KEEP_DOMAINS.some(d => href.includes(d))
      const isCompetitor = COMPETITOR_DOMAINS.some(d => href.includes(d))
      if (isKeep) return match
      if (isCompetitor) return text // Strip link, keep text
      // For all other external links, keep the link (could be government, news sources)
      return match
    })
    const slug = article.slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 80)
    // Meta description — use Arvow's if provided, otherwise generate from excerpt
    const rawMeta = article.meta_description || article.metaDescription || null
    const metaDescription = rawMeta || (() => {
      // Auto-generate from clean text — first 155 chars, ends at word boundary
      const cleanText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      const truncated = cleanText.slice(0, 155)
      const lastSpace = truncated.lastIndexOf(' ')
      return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + '...'
    })()
    const excerpt = article.excerpt || article.summary || content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)
    const keyword = article.keyword || article.target_keyword || null
    const k = (keyword || title).toLowerCase()
    const category = k.includes('dwi') || k.includes('dui') ? 'DWI' :
      k.includes('speeding') || k.includes('speed') ? 'Speeding Tickets' :
      k.includes('dwlr') ? 'DWLR' : k.includes('traffic') ? 'Traffic Law' : 'NC Traffic Law'

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert({
        slug, title, content, excerpt,
        meta_description: metaDescription,
        published: false,
        category,
        tags: keyword ? [keyword] : null,
        author: 'Jeremy Cotten, Attorney at Law',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' })
      .select('id, slug, title')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Sync content_queue: mark matching staged keyword as generated, link the blog post.
    // Best-effort — must never block ingestion.
    let queueMatched: string | null = null
    try {
      if (data?.id) {
        const norm = (s: string | null | undefined) =>
          (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
        const nk = norm(keyword)
        const nt = norm(title)
        const { data: candidates } = await supabase
          .from('content_queue')
          .select('id, keyword, title')
          .in('status', ['queued', 'generating'])
        const match = candidates?.find(
          (r) => (nk && norm(r.keyword) === nk) || (nt && norm(r.title) === nt)
        )
        if (match) {
          await supabase.from('content_queue')
            .update({ status: 'generated', generated_at: new Date().toISOString(),
              published_blog_post_id: data.id })
            .eq('id', match.id)
          queueMatched = match.id
        }
      }
    } catch (syncErr) {
      console.error('content_queue sync failed (non-fatal):', syncErr)
    }

    return NextResponse.json({ success: true, slug: data?.slug, queueMatched })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
}
