import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  meta_description: string | null
  published?: boolean
  published_at: string | null
  created_at: string
  updated_at: string | null
  category: string | null
  tags: string[] | null
  author: string
  featured_image: string | null
}

export async function getAllPosts(): Promise<Omit<BlogPost, 'content'>[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, meta_description, published_at, created_at, updated_at, category, tags, author, featured_image')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  return data || []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) return null
  return data
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string | null,
  tags: string[] | null,
  limit = 4
): Promise<Omit<BlogPost, 'content'>[]> {
  // Build a pool: same category first, then fill from same tags, then recent
  const select = 'id, slug, title, excerpt, published_at, created_at, updated_at, category, tags, author, featured_image, meta_description'

  // Step 1: same category (excluding current post)
  let pool: Omit<BlogPost, 'content'>[] = []

  if (category) {
    const { data } = await supabase
      .from('blog_posts')
      .select(select)
      .eq('published', true)
      .eq('category', category)
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(limit * 3) // fetch more, dedupe below
    if (data) pool = [...data]
  }

  // Step 2: same tags (if pool still thin)
  if (pool.length < limit && tags && tags.length > 0) {
    const { data } = await supabase
      .from('blog_posts')
      .select(select)
      .eq('published', true)
      .neq('slug', currentSlug)
      .overlaps('tags', tags)
      .order('published_at', { ascending: false })
      .limit(limit * 3)
    if (data) {
      for (const p of data) {
        if (!pool.find(x => x.slug === p.slug)) pool.push(p)
      }
    }
  }

  // Step 3: fill remaining slots with recent posts
  if (pool.length < limit) {
    const { data } = await supabase
      .from('blog_posts')
      .select(select)
      .eq('published', true)
      .neq('slug', currentSlug)
      .order('published_at', { ascending: false })
      .limit(limit * 2)
    if (data) {
      for (const p of data) {
        if (!pool.find(x => x.slug === p.slug)) pool.push(p)
      }
    }
  }

  return pool.slice(0, limit)
}
