const STRAPI_ASSET_URL = (
  import.meta.env.CDN_URL || import.meta.env.STRAPI_URL || ""
).replace(/\/$/, "")

export function toAbsoluteStrapiUrl(url) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  if (!STRAPI_ASSET_URL) return url
  return `${STRAPI_ASSET_URL}${url.startsWith("/") ? url : `/${url}`}`
}

export function getStrapiImageVariants(media) {
  if (!media) return []

  const formats = media.formats || {}
  const variants = [
    formats.thumbnail
      ? {
          key: "thumbnail",
          url: toAbsoluteStrapiUrl(formats.thumbnail.url) || formats.thumbnail.url,
          width: formats.thumbnail.width,
          height: formats.thumbnail.height,
        }
      : null,
    formats.small
      ? {
          key: "small",
          url: toAbsoluteStrapiUrl(formats.small.url) || formats.small.url,
          width: formats.small.width,
          height: formats.small.height,
        }
      : null,
    formats.medium
      ? {
          key: "medium",
          url: toAbsoluteStrapiUrl(formats.medium.url) || formats.medium.url,
          width: formats.medium.width,
          height: formats.medium.height,
        }
      : null,
    formats.large
      ? {
          key: "large",
          url: toAbsoluteStrapiUrl(formats.large.url) || formats.large.url,
          width: formats.large.width,
          height: formats.large.height,
        }
      : null,
    media.url
      ? {
          key: "original",
          url: toAbsoluteStrapiUrl(media.url) || media.url,
          width: media.width,
          height: media.height,
        }
      : null,
  ]
    .filter(Boolean)
    .filter((variant) => variant.url)
    .sort((left, right) => (left.width || 0) - (right.width || 0))

  const deduped = []

  for (const variant of variants) {
    const duplicate = deduped.some(
      (entry) => entry.url === variant.url || (entry.width && entry.width === variant.width)
    )

    if (!duplicate) {
      deduped.push(variant)
    }
  }

  return deduped
}

export function buildStrapiSrcSet(media) {
  return getStrapiImageVariants(media)
    .filter((variant) => variant.width)
    .map((variant) => `${variant.url} ${variant.width}w`)
    .join(", ")
}

export function pickStrapiImageSource(media, options = {}) {
  const { targetWidth = null, allowOriginal = false } = options
  const variants = getStrapiImageVariants(media)

  if (variants.length === 0) return null

  const candidates = allowOriginal ? variants : variants.filter((variant) => variant.key !== "original")
  const available = candidates.length > 0 ? candidates : variants

  if (!targetWidth) {
    return available[available.length - 1]
  }

  return available.find((variant) => (variant.width || 0) >= targetWidth) || available[available.length - 1]
}

export function normalizeStrapiMedia(media, fallbackAlt) {
  const rawMedia = media?.data ? media.data : media
  if (!rawMedia) return null

  const item = rawMedia?.attributes ? { id: rawMedia.id, ...rawMedia.attributes } : rawMedia
  const variants = getStrapiImageVariants(item)
  const preferred = pickStrapiImageSource(item, { targetWidth: 1200 }) || variants[0] || null
  const largest = variants[variants.length - 1] || preferred

  if (!preferred?.url) return null

  return {
    id: item.id,
    alt: item.alternativeText || item.name || fallbackAlt,
    url: preferred.url,
    largeUrl: largest?.url || preferred.url,
    width: item.width,
    height: item.height,
    formats: item.formats || {},
    variants,
    srcSet: buildStrapiSrcSet(item),
  }
}
