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
  const headers = {
    Accept: "application/json",
  }

  if (import.meta.env.STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${import.meta.env.STRAPI_API_TOKEN}`
  }

  const res = await fetch(url.toString(), { headers })
  const contentType = res.headers.get("content-type") || ""
  const rawBody = await res.text()

  let payload = null

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody)
    } catch (error) {
      const preview = rawBody.slice(0, 180).replace(/\s+/g, " ").trim()
      throw new Error(
        `Strapi returned non-JSON content (${res.status}, ${contentType || "unknown content type"}). Response starts with: ${preview}`
      )
    }
  }

  if (!res.ok) {
    const message = payload?.error?.message || `Strapi request failed (${res.status})`
    throw new Error(message)
  }

  let data = payload

  if (wrappedByKey) {
    data = data?.[wrappedByKey]
  }

  if (wrappedByList) {
    data = data[0]
  }

  return data
}
