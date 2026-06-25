import { getAllPosts, type BlogPost } from '@/lib/supabase'
import { categorySlug } from '@/lib/categories'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const posts = await getAllPosts()
  const slugs = new Set(posts.map((p) => categorySlug(p.category)))
  return Array.from(slugs).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const posts = (await getAllPosts()) as Omit<BlogPost, 'content'>[]
  const match = posts.find((p) => categorySlug(p.category) === slug)
  const name = match?.category || 'Articles'
  return {
    title: `${name} — NC Traffic & Criminal Defense`,
    description: `Articles on ${name.toLowerCase()} in North Carolina from attorney Jeremy Cotten — what the charge means, what it costs, and how cases resolve.`,
    alternates: { canonical: `https://blog.cottenfirm.com/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const allPosts = (await getAllPosts()) as Omit<BlogPost, 'content'>[]
  const posts = allPosts.filter((p) => categorySlug(p.category) === slug)
  if (posts.length === 0) notFound()
  const name = posts[0].category || 'Articles'

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${name} — Cotten Firm Law Blog`,
    url: `https://blog.cottenfirm.com/category/${slug}`,
    hasPart: posts.slice(0, 50).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://blog.cottenfirm.com/${p.slug}`,
    })),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <div className="text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-blue-600">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-600">{name}</span>
      </div>

      <h1 className="text-3xl font-bold text-slate-900 mb-2">{name}</h1>
      <p className="text-slate-500 mb-8">
        {posts.length} article{posts.length === 1 ? '' : 's'} on {name.toLowerCase()} in North Carolina.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/${p.slug}`}
            className="block p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <h2 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
              {p.title}
            </h2>
            {p.excerpt && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.excerpt}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-slate-900 rounded-2xl text-center">
        <h2 className="text-white text-xl font-bold mb-2">Facing this kind of charge in NC?</h2>
        <p className="text-slate-400 text-sm mb-4">
          Sign up online in minutes — we handle the court appearance so you don&rsquo;t have to.
        </p>
        <a
          href={`https://portal.cottenfirm.com?utm_source=blog&utm_medium=category&utm_campaign=${slug}`}
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
        >
          Hire Us Now → Get Started
        </a>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-slate-400 hover:text-blue-600">← Back to all articles</Link>
      </div>
    </div>
  )
}
