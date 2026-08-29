export type RestaurantNameApiItem = {
  id: string
  name: string
}

type RestaurantPageApiResponse = {
  items: RestaurantNameApiItem[]
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function fetchRestaurantNames(): Promise<
  RestaurantNameApiItem[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants?open=true&page=0&size=3`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants: ${response.status}`)
  }

  const data = (await response.json()) as RestaurantPageApiResponse

  return data.items
}