const STRAPI_URL = (import.meta.env.STRAPI_URL || "").replace(/\/$/, "")
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN || ""
const STRAPI_ASSET_URL = (
  import.meta.env.CDN_URL || import.meta.env.STRAPI_URL || ""
).replace(/\/$/, "")

function toAbsoluteStrapiUrl(url) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  if (!STRAPI_ASSET_URL) return url
  return `${STRAPI_ASSET_URL}${url.startsWith("/") ? url : `/${url}`}`
}

async function strapiRequest(path) {
  if (!STRAPI_URL) {
    throw new Error("Missing STRAPI_URL environment variable.")
  }

  const headers = {
    Accept: "application/json",
  }

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`
  }

  const response = await fetch(`${STRAPI_URL}${path}`, { headers })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      response.status === 401
        ? "Strapi rejected STRAPI_API_TOKEN. Generate a new API token in Strapi and update the Astro `.env` file."
        : response.status === 403
          ? "The case-study collection is not public in Strapi, and the current Astro credentials do not have access."
          : payload?.error?.message || `Strapi request failed (${response.status})`
    throw new Error(message)
  }

  return payload
}

function unwrapEntity(entry) {
  if (entry?.attributes) {
    return {
      id: entry.id,
      ...entry.attributes,
    }
  }

  return entry
}

function unwrapCollection(payload) {
  const entries = payload?.data || payload || []
  if (!Array.isArray(entries)) return []
  return entries.map((entry) => unwrapEntity(entry))
}

function unwrapSingle(payload) {
  const raw = payload?.data ?? payload

  if (!raw) return null
  if (Array.isArray(raw)) return raw[0] ? unwrapEntity(raw[0]) : null

  return unwrapEntity(raw)
}

function normalizeMedia(media) {
  const rawMedia = media?.data ? media.data : media
  if (!rawMedia) return null

  const item = unwrapEntity(rawMedia)
  const formats = item.formats || {}
  const largeCandidate =
    formats.large?.url || formats.medium?.url || formats.small?.url || item.url || null
  const baseUrl = item.url || largeCandidate

  if (!baseUrl) return null

  return {
    id: item.id,
    alt: item.alternativeText || item.name || "Case study image",
    url: toAbsoluteStrapiUrl(baseUrl) || baseUrl,
    largeUrl: toAbsoluteStrapiUrl(largeCandidate || baseUrl) || baseUrl,
    width: item.width,
    height: item.height,
  }
}

function normalizeMediaList(media) {
  const list = Array.isArray(media) ? media : media?.data || []

  return list.map((item) => normalizeMedia(item)).filter(Boolean)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function normalizeRichText(value) {
  if (typeof value === "string") return value
  if (!value) return ""

  const nodes = Array.isArray(value) ? value : [value]

  return nodes.map((node) => renderRichTextNode(node)).join("")
}

function renderRichTextNode(node) {
  if (!node || typeof node !== "object") return ""

  if (node.type === "text") {
    let content = escapeHtml(node.text || "")

    if (node.code) content = `<code>${content}</code>`
    if (node.bold) content = `<strong>${content}</strong>`
    if (node.italic) content = `<em>${content}</em>`
    if (node.underline) content = `<u>${content}</u>`
    if (node.strikethrough) content = `<s>${content}</s>`

    return content
  }

  const children = Array.isArray(node.children)
    ? node.children.map((child) => renderRichTextNode(child)).join("")
    : ""

  if (node.type === "link") {
    const href = escapeHtml(node.url || node.href || "#")
    return `<a href="${href}" target="_blank" rel="noreferrer">${children}</a>`
  }

  if (node.type === "list") {
    const tag = node.format === "ordered" ? "ol" : "ul"
    return `<${tag}>${children}</${tag}>`
  }

  if (node.type === "list-item") {
    return `<li>${children}</li>`
  }

  if (node.type === "quote") {
    return `<blockquote>${children}</blockquote>`
  }

  if (node.type === "code") {
    return `<pre><code>${escapeHtml(node.code || "")}</code></pre>`
  }

  if (node.type === "heading") {
    const level = Math.min(Math.max(Number(node.level) || 2, 1), 6)
    return `<h${level}>${children}</h${level}>`
  }

  if (node.type === "paragraph") {
    return `<p>${children}</p>`
  }

  return children
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return ""
}

function firstRichText(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value
    }

    if (Array.isArray(value) && value.length > 0) {
      return normalizeRichText(value)
    }

    if (value && typeof value === "object") {
      return normalizeRichText(value)
    }
  }

  return ""
}

function normalizeSlugHistory(value) {
  if (!Array.isArray(value)) return []

  return value
    .map((entry) => String(entry || "").trim())
    .filter(Boolean)
}

function normalizeBlocks(blocks) {
  if (!Array.isArray(blocks)) return []

  return blocks
    .map((block, index) => {
      const component = String(block?.__component || "")
      const heading = firstString(block.heading, block.title, block.name)
      const content = firstRichText(
        block.content,
        block.body,
        block.text,
        block.copy,
        block.description
      )
      const singleImage = normalizeMedia(
        block.image ||
          block.media ||
          block.asset ||
          block.photo ||
          block.coverImage ||
          null
      )
      const imageList = normalizeMediaList(block.images || block.gallery || [])
      const videoUrl = firstString(
        block.url,
        block.videoUrl,
        block.embedUrl,
        block.externalUrl
      )
      const caption = firstString(block.caption, block.description, block.credit)

      if (component === "case-study.long-text" || component.includes("text")) {
        return {
          id: block.id || `text-${index}`,
          type: "long-text",
          component,
          heading,
          content,
        }
      }

      if (
        component === "case-study.image-block" ||
        component.includes("image") ||
        component.includes("media")
      ) {
        if (imageList.length > 1) {
          return {
            id: block.id || `gallery-${index}`,
            type: "gallery",
            component,
            heading,
            caption,
            images: imageList,
          }
        }

        return {
          id: block.id || `image-${index}`,
          type: "image",
          component,
          heading,
          caption,
          image: singleImage || imageList[0] || null,
        }
      }

      if (component === "case-study.video-block" || component.includes("video")) {
        return {
          id: block.id || `video-${index}`,
          type: "video",
          component,
          title: heading,
          caption,
          url: videoUrl,
        }
      }

      if (content) {
        return {
          id: block.id || `text-${index}`,
          type: "long-text",
          component,
          heading,
          content,
        }
      }

      if (singleImage || imageList.length > 0) {
        return {
          id: block.id || `image-${index}`,
          type: imageList.length > 1 ? "gallery" : "image",
          component,
          heading,
          caption,
          image: singleImage || imageList[0] || null,
          images: imageList,
        }
      }

      if (videoUrl) {
        return {
          id: block.id || `video-${index}`,
          type: "video",
          component,
          title: heading,
          caption,
          url: videoUrl,
        }
      }

      return null
    })
    .filter(Boolean)
    .filter((block) => {
      if (block.type === "image") return Boolean(block.image)
      if (block.type === "gallery") return Array.isArray(block.images) && block.images.length > 0
      if (block.type === "video") return Boolean(block.url)
      if (block.type === "long-text") return Boolean(block.content)
      return false
    })
}

function mapCaseStudySummary(entry) {
  const coverImage = normalizeMedia(entry.coverImage)

  return {
    id: entry.id,
    type: "case-study",
    slug: String(entry.slug || ""),
    title: String(entry.title || "Untitled case study"),
    shortDescription: String(entry.excerpt || ""),
    intro: firstRichText(entry.intro, entry.summary, entry.description),
    thumbnail: coverImage,
    coverImage,
  }
}

async function fetchCaseStudyRedirectSlug(slug) {
  if (!slug) return null

  const payload = await strapiRequest(
    "/api/case-studies?fields[0]=slug&fields[1]=previousSlugs&pagination[pageSize]=500"
  )

  const match = unwrapCollection(payload).find((entry) =>
    normalizeSlugHistory(entry.previousSlugs).includes(slug)
  )

  return match?.slug ? String(match.slug).trim() : null
}

export async function fetchCaseStudies() {
  const payload = await strapiRequest(
    "/api/case-studies?sort[0]=publishedAt:desc&sort[1]=title:asc&populate[coverImage]=*"
  )

  return unwrapCollection(payload)
    .map(mapCaseStudySummary)
    .filter((entry) => entry.slug)
}

export async function fetchCaseStudyBySlug(slug) {
  const payload = await strapiRequest(
    `/api/case-studies?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[coverImage]=*&populate[blocks][populate]=*`
  )

  const entry = unwrapSingle(payload)

  if (!entry) return null

  const summary = mapCaseStudySummary(entry)
  const blocks = normalizeBlocks(entry.blocks)

  return {
    ...summary,
    blocks,
    unsupportedBlockCount: Array.isArray(entry.blocks) ? entry.blocks.length - blocks.length : 0,
  }
}

export async function resolveCaseStudyBySlug(slug) {
  const caseStudy = await fetchCaseStudyBySlug(slug)
  if (caseStudy) {
    return { caseStudy, redirectTo: null }
  }

  const redirectSlug = await fetchCaseStudyRedirectSlug(slug)

  return {
    caseStudy: null,
    redirectTo: redirectSlug && redirectSlug !== slug ? caseStudyPath(redirectSlug) : null,
  }
}

export function caseStudyPath(slug) {
  return `/case-studies/${slug}`
}

export function isCaseStudyConfigured() {
  return Boolean(STRAPI_URL)
}

export function isCaseStudyAuthConfigured() {
  return Boolean(STRAPI_API_TOKEN)
}
