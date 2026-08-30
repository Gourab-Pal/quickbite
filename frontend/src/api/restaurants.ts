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
  pureVeg: boolean
  featured: boolean
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export type RestaurantFilters = {
  pureVeg?: boolean
  minimumRating?: number
  maximumDeliveryMinutes?: number
}

export async function fetchRestaurantNames(
    page: number,
    size: number,
    filters: RestaurantFilters = {},
): Promise<RestaurantPageApiResponse> {
  const queryParameters = new URLSearchParams()

  queryParameters.set('open', 'true')
  queryParameters.set('page', String(page))
  queryParameters.set('size', String(size))

  if (filters.pureVeg) {
    queryParameters.set('pureVeg', 'true')
  }

  if (filters.minimumRating !== undefined) {
    queryParameters.set(
        'averageRatingThreshold',
        String(filters.minimumRating),
    )
  }

  if (filters.maximumDeliveryMinutes !== undefined) {
    queryParameters.set(
        'maximumDeliveryMinutes',
        String(filters.maximumDeliveryMinutes),
    )
  }

  const response = await fetch(
      `${API_BASE_URL}/api/v1/restaurants?${queryParameters.toString()}`,
  )

  if (!response.ok) {
    throw new Error(
        `Failed to fetch restaurants: ${response.status}`,
    )
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