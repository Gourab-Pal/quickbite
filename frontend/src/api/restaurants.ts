export type RestaurantNameApiItem = {
    id: string
    name: string
}

type RestaurantPageApiResponse = {
    items: RestaurantNameApiItem[]
}

export async function fetchRestaurantNames(): Promise<RestaurantNameApiItem[]> {
    const response = await fetch(
        'http://localhost:8080/api/v1/restaurants?open=true&page=0&size=3',
    )

    if (!response.ok) {
        throw new Error('Error fetching restaurant name: status:: ' + response.statusText)
    }

    const data = (await response.json()) as RestaurantPageApiResponse

    return data.items
}