export type RestaurantNameApiItem = {
  id: string
  name: string
  averageRating: number
  maximumDeliveryMinutes: number
  cuisines: string[]
  area: string
  primaryOffer: string
  averageCostForTwo: number
  imageUrl: string
  slug: string
}

type RestaurantPageApiResponse = {
  items: RestaurantNameApiItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function fetchRestaurantNames(page: number, size: number): Promise<RestaurantPageApiResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/restaurants?open=true&page=${page}&size=${size}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants: ${response.status}`)
  }

  return (await response.json()) as RestaurantPageApiResponse
}

export type RestaurantDetailsApiResponse = {
  id: string
  name: string
  imageUrl: string
  area: string
  city: string
  shortDescription: string
  averageRating: number
  maximumDeliveryMinutes: number
  averageCostForTwo: number
  totalRatings: number
}

export async function fetchRestaurantById(
    id: string,
): Promise<RestaurantDetailsApiResponse> {
  const response = await fetch(
      `${API_BASE_URL}/api/v1/restaurants/${id}`,
  )

  if (!response.ok) {
    throw new Error(
        `Failed to fetch restaurant ${id}: ${response.status}`,
    )
  }

  return (await response.json()) as RestaurantDetailsApiResponse
}