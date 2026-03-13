const STRAPI_URL = (import.meta.env.STRAPI_URL || "").replace(/\/$/, "")
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN || ""
const STRAPI_PORTFOLIO_COLLECTION =
  import.meta.env.STRAPI_PORTFOLIO_COLLECTION || "portfolio-projects"
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
    const message = payload?.error?.message || `Strapi request failed (${response.status})`
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
    alt: item.alternativeText || item.name || "Portfolio image",
    url: toAbsoluteStrapiUrl(baseUrl) || baseUrl,
    largeUrl: toAbsoluteStrapiUrl(largeCandidate || baseUrl) || baseUrl,
    width: item.width,
    height: item.height,
  }
}

function normalizeFolder(folder) {
  const rawFolder = folder?.data ? folder.data : folder
  if (!rawFolder) return null

  const item = unwrapEntity(rawFolder)

  return {
    id: item.id,
    name: item.name || null,
    path: item.path || null,
  }
}

function normalizeVideos(videos) {
  const list = Array.isArray(videos) ? videos : videos?.data || []

  return list
    .map((video) => (video?.attributes ? video.attributes : video))
    .filter((video) => typeof video?.url === "string" && video.url.trim().length > 0)
    .map((video, index) => ({
      title: String(video.title || `Project video ${index + 1}`),
      url: String(video.url).trim(),
    }))
}

function mapProjectSummary(entry) {
  const thumbnail = normalizeMedia(entry.thumbnailImage) || normalizeMedia(entry.coverImage)

  return {
    id: entry.id,
    slug: String(entry.slug || ""),
    title: String(entry.title || "Untitled project"),
    address: String(entry.address || ""),
    size: String(entry.size || ""),
    shortDescription: String(entry.shortDescription || ""),
    thumbnail,
  }
}

async function fetchFolderImages(folderId) {
  if (!folderId) return []

  const payload = await strapiRequest(`/api/upload/files?folder=${folderId}&sort=createdAt:ASC`)
  const files = Array.isArray(payload)
    ? payload
    : payload?.results || payload?.data?.results || payload?.data || []

  return files
    .map((file) => normalizeMedia(file))
    .filter(Boolean)
}

export async function fetchPortfolioProjects() {
  const payload = await strapiRequest(
    `/api/${STRAPI_PORTFOLIO_COLLECTION}?sort[0]=publishedAt:desc&sort[1]=title:asc&populate=*`
  )

  return unwrapCollection(payload)
    .map(mapProjectSummary)
    .filter((project) => project.slug)
}

export async function fetchPortfolioProjectBySlug(slug) {
  const payload = await strapiRequest(
    `/api/${STRAPI_PORTFOLIO_COLLECTION}?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  )
  const entry = unwrapSingle(payload)

  if (!entry) return null

  const summary = mapProjectSummary(entry)
  const folder = normalizeFolder(entry.mediaFolder)
  const images = await fetchFolderImages(folder?.id)

  return {
    ...summary,
    longDescription: String(entry.longDescription || ""),
    coverImage: normalizeMedia(entry.coverImage) || summary.thumbnail,
    folder,
    videos: normalizeVideos(entry.videos),
    images,
    mapQuery: String(entry.address || ""),
  }
}

export function portfolioProjectPath(slug) {
  return `/portfolio/${slug}`
}

export function getMapEmbedUrl(query) {
  const safeQuery = String(query || "").trim()
  if (!safeQuery) return null
  return `https://www.google.com/maps?q=${encodeURIComponent(safeQuery)}&z=14&output=embed`
}

export function isPortfolioConfigured() {
  return Boolean(STRAPI_URL)
}

export function isPortfolioAuthConfigured() {
  return Boolean(STRAPI_API_TOKEN)
}
