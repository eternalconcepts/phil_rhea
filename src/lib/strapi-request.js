const DEFAULT_MAX_RETRIES = 3

export class StrapiRequestError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = "StrapiRequestError"
    this.status = options.status ?? null
    this.contentType = options.contentType ?? ""
    this.preview = options.preview ?? ""
    this.temporary = Boolean(options.temporary)
    this.retryable = Boolean(options.retryable)
    this.cause = options.cause
  }
}

export function isTemporaryStrapiError(error) {
  return Boolean(error?.temporary)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizePreview(rawBody) {
  return rawBody.slice(0, 180).replace(/\s+/g, " ").trim()
}

function isJsonContentType(contentType) {
  return contentType.toLowerCase().includes("application/json")
}

function getRetryDelay(attempt) {
  return 300 * (attempt + 1)
}

function buildStrapiUrl({ baseUrl, path, query }) {
  const normalizedBaseUrl = String(baseUrl || "").replace(/\/$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${normalizedBaseUrl}${normalizedPath}`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      url.searchParams.append(key, String(value))
    })
  }

  return url
}

function buildHeaders(token) {
  const headers = {
    Accept: "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function buildStrapiError({ response, contentType, rawBody, payload, cause }) {
  const status = response?.status ?? null
  const preview = rawBody ? normalizePreview(rawBody) : ""
  const temporary = !response || status >= 500
  const retryable = !response || status >= 400

  if (!response) {
    return new StrapiRequestError("Unable to reach Strapi.", {
      temporary: true,
      retryable: true,
      cause,
    })
  }

  if (!isJsonContentType(contentType)) {
    return new StrapiRequestError(
      `Strapi returned non-JSON content (${status}, ${contentType || "unknown content type"}).${preview ? ` Response starts with: ${preview}` : ""}`,
      {
        status,
        contentType,
        preview,
        temporary,
        retryable,
        cause,
      }
    )
  }

  return new StrapiRequestError(
    payload?.error?.message || `Strapi request failed (${status})`,
    {
      status,
      contentType,
      preview,
      temporary,
      retryable,
      cause,
    }
  )
}

export async function requestStrapi({
  path,
  query,
  baseUrl = import.meta.env.STRAPI_URL || process.env.STRAPI_URL || "",
  token = import.meta.env.STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN || "",
  maxRetries = DEFAULT_MAX_RETRIES,
  logLabel = null,
}) {
  const normalizedBaseUrl = String(baseUrl || "").replace(/\/$/, "")

  if (!normalizedBaseUrl) {
    throw new StrapiRequestError("Missing STRAPI_URL environment variable.")
  }

  const url = buildStrapiUrl({
    baseUrl: normalizedBaseUrl,
    path,
    query,
  })

  if (logLabel) {
    console.log(`Fetching data from Strapi: ${url.toString()}`)
  }

  const headers = buildHeaders(token)
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetch(url.toString(), { headers })
      const contentType = response.headers.get("content-type") || ""
      const rawBody = await response.text()
      let payload = null

      if (rawBody && isJsonContentType(contentType)) {
        try {
          payload = JSON.parse(rawBody)
        } catch (error) {
          throw buildStrapiError({
            response,
            contentType,
            rawBody,
            cause: error,
          })
        }
      }

      if (!response.ok || !isJsonContentType(contentType)) {
        throw buildStrapiError({
          response,
          contentType,
          rawBody,
          payload,
        })
      }

      return payload
    } catch (error) {
      const wrappedError =
        error instanceof StrapiRequestError
          ? error
          : new StrapiRequestError("Unable to reach Strapi.", {
              temporary: true,
              retryable: true,
              cause: error,
            })

      lastError = wrappedError

      if (!wrappedError.retryable || attempt === maxRetries) {
        throw wrappedError
      }

      await sleep(getRetryDelay(attempt))
    }
  }

  throw lastError || new StrapiRequestError("Unable to reach Strapi.", { temporary: true, retryable: true })
}
