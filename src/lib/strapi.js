import { requestStrapi } from "./strapi-request"

export default async function fetchApi({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}) {
  const payload = await requestStrapi({
    path: `/api/${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`,
    query,
    logLabel: "home-page",
  })

  let data = payload

  if (wrappedByKey) {
    data = data?.[wrappedByKey]
  }

  if (wrappedByList) {
    data = data[0]
  }

  return data
}
