export type Restaurant = {
  id: string
  slug: string
  name: string
  description: string
  image: string
  cuisines: string[]
  area: string
  city: string
  rating: number
  ratingCount: string
  deliveryMinutes: number
  priceForTwo: number
  offer: string
  featured: boolean
  open: boolean
  distance: string
  pureVeg?: boolean
  dineout?: boolean
}

export type MenuItem = {
  id: string
  restaurantId: string
  category: string
  name: string
  description: string
  image: string
  price: number
  veg: boolean
  rating: number
  ratingCount: number
  bestseller?: boolean
  customizable?: boolean
  soldOut?: boolean
}

export type CartLine = MenuItem & {
  quantity: number
  option?: string
}

export type Address = {
  id: string
  label: 'Home' | 'Work' | 'Other'
  line1: string
  line2: string
  instructions?: string
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'delivered'
  | 'cancelled'

export type Order = {
  id: string
  restaurantId: string
  restaurantName: string
  restaurantImage: string
  date: string
  amount: number
  status: OrderStatus
  address: string
  eta?: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export type Offer = {
  id: string
  title: string
  description: string
  code: string
  discount: number
  minimum: number
  type: 'restaurant' | 'payment' | 'delivery'
}

export type PartnerOrder = {
  id: string
  customer: string
  items: string
  minutes: number
  amount: number
  stage: 'new' | 'preparing' | 'ready'
}

export type AdminIssue = {
  id: string
  type: string
  details: string
  status:
    | 'Pending review'
    | 'Delayed'
    | 'Under review'
    | 'Service issue'
  owner: string
  age: string
}

export type OverlayType =
  | 'auth'
  | 'location'
  | 'filters'
  | 'item'
  | 'replace-cart'
  | 'cart'
  | 'coupons'
  | 'address'
  | 'payment'
  | 'cancel-order'
  | 'rating'
  | 'support-chat'
  | 'confirm'

export type OverlayState =
  | {
      type: OverlayType
      payload?: unknown
    }
  | null