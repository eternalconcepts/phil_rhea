// strapi.js file
/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}) {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1)
  }

  console.log(
    `Fetching data from Strapi: ${import.meta.env.STRAPI_URL}/api/${endpoint}`
  )
  const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  const res = await fetch(url.toString())
  let data = await res.json()

  if (wrappedByKey) {
    data = data[wrappedByKey]
  }

  if (wrappedByList) {
    data = data[0]
  }

  // ─── POST-PROCESS ALL MEDIA URLS ───────────────────────────────────────────
  // if you ever want to switch to serving from a CDN, just set MEDIA_URL
  const MEDIA_BASE = (
    import.meta.env.MEDIA_URL || import.meta.env.STRAPI_URL
  ).replace(/\/$/, "")

  function fixUrls(obj) {
    if (obj == null || typeof obj !== "object") return obj
    if (Array.isArray(obj)) return obj.map(fixUrls)

    const out = {}
    for (const [k, v] of Object.entries(obj)) {
      if (k === "url" && typeof v === "string") {
        // strip any existing protocol://host
        const path = v.replace(/^https?:\/\/[^\/]+/, "")
        // now prefix exactly once
        out[k] = path.startsWith("/")
          ? MEDIA_BASE + path
          : MEDIA_BASE + "/" + path
      } else {
        out[k] = fixUrls(v)
      }
    }
    return out
  }

  data = fixUrls(data)
  // ──────────────────────────────────────────────────────────────────────────

  return data
}
