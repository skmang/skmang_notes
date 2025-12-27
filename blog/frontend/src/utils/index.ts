import type { Post } from '~/types'
import { getCollection } from 'astro:content'
import dayjs from 'dayjs'
import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'

export async function getCategories() {
  const posts = await getPosts()
  const categories = new Map<string, Post[]>()

  for (const post of posts) {
    if (post.data.categories) {
      for (const c of post.data.categories) {
        const posts = categories.get(c) || []
        posts.push(post)
        categories.set(c, posts)
      }
    }
  }

  return categories
}

export async function getPosts(isArchivePage = false) {
  const posts = await getCollection('posts')

  posts.sort((a, b) => {
    if (isArchivePage) {
      return dayjs(a.data.pubDate).isBefore(dayjs(b.data.pubDate)) ? 1 : -1
    }

    const aDate = a.data.modDate ? dayjs(a.data.modDate) : dayjs(a.data.pubDate)
    const bDate = b.data.modDate ? dayjs(b.data.modDate) : dayjs(b.data.pubDate)

    return aDate.isBefore(bDate) ? 1 : -1
  })

  if (import.meta.env.PROD) {
    return posts.filter(post => post.data.draft !== true)
  }

  return posts
}

const parser = new MarkdownIt()
export function getPostDescription(post: Post) {
  if (post.data.description) {
    return post.data.description
  }

  const html = parser.render(post.body || '')
  const sanitized = sanitizeHtml(html, { allowedTags: [] })
  return sanitized.slice(0, 400)
}

export function formatDate(date: Date, format: string = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

const externalProtocolPattern = /^[a-z][a-z0-9+.-]*:/i

export function withBase(path: string) {
  if (!path || path.startsWith('#') || path.startsWith('?') || path.startsWith('//')) {
    return path
  }

  if (externalProtocolPattern.test(path)) {
    return path
  }

  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const baseWithoutTrailing = normalizedBase === '/' ? '/' : normalizedBase.slice(0, -1)
  const { pathPart, suffix } = splitPathSuffix(path)

  let resolvedPath: string
  if (baseWithoutTrailing !== '/' && pathPart.startsWith(`${baseWithoutTrailing}/`)) {
    resolvedPath = pathPart
  }
  else if (baseWithoutTrailing !== '/' && pathPart === baseWithoutTrailing) {
    resolvedPath = normalizedBase
  }
  else {
    const normalizedPath = pathPart.replace(/^\/+/, '')
    resolvedPath = `${normalizedBase}${normalizedPath}`
  }

  return `${ensureTrailingSlash(resolvedPath)}${suffix}`
}

export function getPathFromCategory(
  category: string,
  category_map: { name: string, path: string }[],
) {
  const mappingPath = category_map.find(l => l.name === category)
  return mappingPath ? mappingPath.path : category
}

function splitPathSuffix(path: string) {
  const match = path.match(/^[^?#]+/)
  const pathPart = match ? match[0] : ''
  const suffix = path.slice(pathPart.length)
  return { pathPart, suffix }
}

function ensureTrailingSlash(path: string) {
  if (!path || path.endsWith('/')) {
    return path
  }

  const lastSegment = path.split('/').pop() ?? ''
  if (lastSegment.includes('.') && !lastSegment.startsWith('.')) {
    return path
  }

  return `${path}/`
}
