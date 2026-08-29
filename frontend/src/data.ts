import type {
  Address,
  AdminIssue,
  MenuItem,
  Offer,
  Order,
  PartnerOrder,
  Restaurant,
} from './types'

export const cuisineCategories = [
  { name: 'Biryani', image: '/assets/food/biryani.jpg' },
  { name: 'Pizza', image: '/assets/food/pizza.jpg' },
  { name: 'South Indian', image: '/assets/food/breakfast.jpg' },
  { name: 'North Indian', image: '/assets/food/indian-thali.jpg' },
  { name: 'Chinese', image: '/assets/food/noodles.jpg' },
  { name: 'Burgers', image: '/assets/food/burger.jpg' },
  { name: 'Desserts', image: '/assets/food/cake.jpg' },
  { name: 'Healthy', image: '/assets/food/salad.jpg' },
]

export const restaurants: Restaurant[] = [
  {
    id: 'rest-101',
    slug: 'meghana-foods',
    name: 'Meghana Foods',
    description:
      'Bold Andhra flavours, aromatic biryanis and generous family meals.',
    image: '/assets/food/indian-thali.jpg',
    cuisines: ['Biryani', 'Andhra', 'North Indian'],
    area: 'Koramangala 5th Block',
    city: 'Bengaluru',
    rating: 4.6,
    ratingCount: '12K+',
    deliveryMinutes: 28,
    priceForTwo: 450,
    offer: '40% OFF up to ₹120',
    featured: true,
    open: true,
    distance: '1.4 km',
    dineout: true,
  },
  {
    id: 'rest-102',
    slug: 'biryani-blues',
    name: 'Biryani Blues',
    description:
      'Slow-cooked Hyderabadi biryani, kebabs and cooling raita.',
    image: '/assets/food/biryani.jpg',
    cuisines: ['Biryani', 'Mughlai', 'Kebabs'],
    area: 'Koramangala 4th Block',
    city: 'Bengaluru',
    rating: 4.5,
    ratingCount: '8K+',
    deliveryMinutes: 31,
    priceForTwo: 380,
    offer: '30% OFF up to ₹100',
    featured: true,
    open: true,
    distance: '2.1 km',
  },
  {
    id: 'rest-103',
    slug: 'la-pinos-pizza',
    name: "La Pino'z Pizza",
    description:
      'Cheesy hand-tossed pizzas, garlic bread and loaded sides.',
    image: '/assets/food/pizza.jpg',
    cuisines: ['Pizza', 'Italian', 'Beverages'],
    area: 'Koramangala 7th Block',
    city: 'Bengaluru',
    rating: 4.4,
    ratingCount: '10K+',
    deliveryMinutes: 32,
    priceForTwo: 550,
    offer: '20% OFF up to ₹80',
    featured: true,
    open: true,
    distance: '2.8 km',
    dineout: true,
  },
  {
    id: 'rest-104',
    slug: 'green-theory',
    name: 'Green Theory',
    description:
      'Wholesome bowls, crisp salads and nourishing smoothies.',
    image: '/assets/food/salad.jpg',
    cuisines: ['Healthy', 'Salads', 'Beverages'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    rating: 4.7,
    ratingCount: '4K+',
    deliveryMinutes: 36,
    priceForTwo: 600,
    offer: 'FREE DELIVERY',
    featured: false,
    open: true,
    distance: '4.2 km',
    pureVeg: true,
    dineout: true,
  },
  {
    id: 'rest-105',
    slug: 'burger-yard',
    name: 'Burger Yard',
    description:
      'Smash burgers, crunchy fries and thick milkshakes.',
    image: '/assets/food/burger.jpg',
    cuisines: ['Burgers', 'American', 'Fast Food'],
    area: 'HSR Layout',
    city: 'Bengaluru',
    rating: 4.3,
    ratingCount: '6K+',
    deliveryMinutes: 34,
    priceForTwo: 420,
    offer: 'ITEMS AT ₹149',
    featured: false,
    open: true,
    distance: '3.7 km',
  },
  {
    id: 'rest-106',
    slug: 'pasta-street',
    name: 'Pasta Street',
    description:
      'Fresh pasta, baked classics and comforting Italian favourites.',
    image: '/assets/food/pasta.jpg',
    cuisines: ['Italian', 'Pasta', 'Desserts'],
    area: 'JP Nagar',
    city: 'Bengaluru',
    rating: 4.2,
    ratingCount: '3K+',
    deliveryMinutes: 43,
    priceForTwo: 700,
    offer: '25% OFF',
    featured: false,
    open: false,
    distance: '5.3 km',
    dineout: true,
  },
  {
    id: 'rest-107',
    slug: 'wok-this-way',
    name: 'Wok This Way',
    description:
      'Wok-tossed noodles, dim sum and pan-Asian comfort food.',
    image: '/assets/food/noodles.jpg',
    cuisines: ['Chinese', 'Asian', 'Momos'],
    area: 'BTM Layout',
    city: 'Bengaluru',
    rating: 4.4,
    ratingCount: '7K+',
    deliveryMinutes: 39,
    priceForTwo: 500,
    offer: '₹125 OFF above ₹399',
    featured: false,
    open: true,
    distance: '4.8 km',
  },
  {
    id: 'rest-108',
    slug: 'corner-house',
    name: 'Corner House',
    description:
      'Classic ice-cream sundaes, cakes and nostalgic desserts.',
    image: '/assets/food/dessert.jpg',
    cuisines: ['Desserts', 'Ice Cream', 'Beverages'],
    area: 'Jayanagar',
    city: 'Bengaluru',
    rating: 4.8,
    ratingCount: '14K+',
    deliveryMinutes: 29,
    priceForTwo: 300,
    offer: 'FLAT ₹75 OFF',
    featured: true,
    open: true,
    distance: '3.1 km',
    pureVeg: true,
  },
  {
    id: 'rest-109',
    slug: 'morning-table',
    name: 'The Morning Table',
    description:
      'All-day breakfast, artisanal coffee and warm baked treats.',
    image: '/assets/food/breakfast.jpg',
    cuisines: ['Breakfast', 'Cafe', 'Continental'],
    area: 'Indiranagar',
    city: 'Bengaluru',
    rating: 4.5,
    ratingCount: '5K+',
    deliveryMinutes: 30,
    priceForTwo: 520,
    offer: '15% OFF',
    featured: false,
    open: true,
    distance: '4.0 km',
    dineout: true,
  },
]

const menuSeed: Array<Omit<MenuItem, 'id' | 'restaurantId'>> = [
  {
    category: 'Bestsellers',
    name: 'Signature Chicken Biryani',
    description:
      'Fragrant basmati rice layered with tender chicken and house spices.',
    image: '/assets/food/biryani.jpg',
    price: 349,
    veg: false,
    rating: 4.7,
    ratingCount: 1240,
    bestseller: true,
    customizable: true,
  },
  {
    category: 'Bestsellers',
    name: 'Paneer Tikka Feast',
    description:
      'Smoky paneer tikka with mint chutney, salad and soft breads.',
    image: '/assets/food/indian-thali.jpg',
    price: 319,
    veg: true,
    rating: 4.6,
    ratingCount: 876,
    bestseller: true,
    customizable: true,
  },
  {
    category: 'Starters',
    name: 'Crispy Chilli Chicken',
    description:
      'Crisp chicken tossed with peppers, chilli and spring onion.',
    image: '/assets/food/noodles.jpg',
    price: 279,
    veg: false,
    rating: 4.4,
    ratingCount: 542,
  },
  {
    category: 'Starters',
    name: 'Garden Fresh Salad',
    description:
      'Seasonal vegetables, avocado and roasted seeds with citrus dressing.',
    image: '/assets/food/salad.jpg',
    price: 249,
    veg: true,
    rating: 4.5,
    ratingCount: 321,
    customizable: true,
  },
  {
    category: 'Main Course',
    name: 'Classic Margherita Pizza',
    description:
      'Hand-tossed crust, tomato, basil and bubbling mozzarella.',
    image: '/assets/food/pizza.jpg',
    price: 329,
    veg: true,
    rating: 4.5,
    ratingCount: 690,
    customizable: true,
  },
  {
    category: 'Main Course',
    name: 'Smash Chicken Burger',
    description:
      'Crispy chicken, pickles, slaw and house sauce in a toasted bun.',
    image: '/assets/food/burger.jpg',
    price: 289,
    veg: false,
    rating: 4.4,
    ratingCount: 489,
    customizable: true,
  },
  {
    category: 'Main Course',
    name: 'Truffle Mushroom Pasta',
    description:
      'Creamy pasta with roasted mushrooms, herbs and parmesan.',
    image: '/assets/food/pasta.jpg',
    price: 399,
    veg: true,
    rating: 4.6,
    ratingCount: 288,
  },
  {
    category: 'Main Course',
    name: 'Street-style Hakka Noodles',
    description:
      'Wok-tossed noodles with crunchy vegetables and chilli oil.',
    image: '/assets/food/noodles.jpg',
    price: 259,
    veg: true,
    rating: 4.3,
    ratingCount: 404,
    soldOut: true,
  },
  {
    category: 'Desserts',
    name: 'Chocolate Celebration Cake',
    description:
      'Dark chocolate sponge layered with silky ganache.',
    image: '/assets/food/cake.jpg',
    price: 229,
    veg: true,
    rating: 4.8,
    ratingCount: 720,
    bestseller: true,
  },
  {
    category: 'Desserts',
    name: 'Warm Donut Bites',
    description:
      'Cinnamon sugar doughnuts with chocolate dipping sauce.',
    image: '/assets/food/dessert.jpg',
    price: 189,
    veg: true,
    rating: 4.5,
    ratingCount: 315,
  },
  {
    category: 'Beverages',
    name: 'Cold Brew Coffee',
    description:
      'Slow-steeped coffee served chilled and smooth.',
    image: '/assets/food/coffee.jpg',
    price: 159,
    veg: true,
    rating: 4.6,
    ratingCount: 212,
  },
]

export const menuItems: MenuItem[] = []

for (
  let restaurantIndex = 0;
  restaurantIndex < restaurants.length;
  restaurantIndex += 1
) {
  const restaurant = restaurants[restaurantIndex]

  for (
    let itemIndex = 0;
    itemIndex < menuSeed.length;
    itemIndex += 1
  ) {
    const item = menuSeed[itemIndex]

    menuItems.push({
      ...item,
      id: `${restaurant.id}-item-${itemIndex + 1}`,
      restaurantId: restaurant.id,
      price: item.price + (restaurantIndex % 3) * 10,
    })
  }
}

export const offers: Offer[] = [
  {
    id: 'offer-1',
    title: 'Flat 40% OFF',
    description: 'Save up to ₹120 on restaurant orders',
    code: 'QUICK40',
    discount: 120,
    minimum: 299,
    type: 'restaurant',
  },
  {
    id: 'offer-2',
    title: 'Free delivery',
    description: 'Delivery fee waived on eligible orders',
    code: 'FREEDEL',
    discount: 45,
    minimum: 149,
    type: 'delivery',
  },
  {
    id: 'offer-3',
    title: 'Extra 15% OFF',
    description: 'Pay using any supported credit card',
    code: 'CARD15',
    discount: 90,
    minimum: 499,
    type: 'payment',
  },
  {
    id: 'offer-4',
    title: 'Welcome to QuickBite',
    description: 'A special saving for your first order',
    code: 'FIRSTBITE',
    discount: 150,
    minimum: 349,
    type: 'restaurant',
  },
]

export const addresses: Address[] = [
  {
    id: 'addr-home',
    label: 'Home',
    line1: '22, 5th Cross, Koramangala',
    line2: 'Bengaluru, Karnataka 560095',
    instructions: 'Leave at the door',
  },
  {
    id: 'addr-work',
    label: 'Work',
    line1: 'Embassy Tech Village, Outer Ring Road',
    line2: 'Devarabeesanahalli, Bengaluru 560103',
  },
]

export const orders: Order[] = [
  {
    id: 'QB-78491',
    restaurantId: 'rest-101',
    restaurantName: 'Meghana Foods',
    restaurantImage: '/assets/food/indian-thali.jpg',
    date: '29 Aug 2026, 1:24 PM',
    amount: 628,
    status: 'preparing',
    address: addresses[0].line1,
    eta: '24–30 min',
    items: [
      {
        name: 'Signature Chicken Biryani',
        quantity: 1,
        price: 349,
      },
      {
        name: 'Crispy Chilli Chicken',
        quantity: 1,
        price: 279,
      },
    ],
  },
  {
    id: 'QB-78302',
    restaurantId: 'rest-103',
    restaurantName: "La Pino'z Pizza",
    restaurantImage: '/assets/food/pizza.jpg',
    date: '26 Aug 2026, 8:15 PM',
    amount: 518,
    status: 'delivered',
    address: addresses[0].line1,
    items: [
      {
        name: 'Classic Margherita Pizza',
        quantity: 1,
        price: 329,
      },
      {
        name: 'Warm Donut Bites',
        quantity: 1,
        price: 189,
      },
    ],
  },
  {
    id: 'QB-77942',
    restaurantId: 'rest-107',
    restaurantName: 'Wok This Way',
    restaurantImage: '/assets/food/noodles.jpg',
    date: '18 Aug 2026, 7:41 PM',
    amount: 538,
    status: 'delivered',
    address: addresses[1].line1,
    items: [
      {
        name: 'Street-style Hakka Noodles',
        quantity: 1,
        price: 259,
      },
      {
        name: 'Crispy Chilli Chicken',
        quantity: 1,
        price: 279,
      },
    ],
  },
  {
    id: 'QB-77018',
    restaurantId: 'rest-105',
    restaurantName: 'Burger Yard',
    restaurantImage: '/assets/food/burger.jpg',
    date: '02 Aug 2026, 9:02 PM',
    amount: 289,
    status: 'cancelled',
    address: addresses[0].line1,
    items: [
      {
        name: 'Smash Chicken Burger',
        quantity: 1,
        price: 289,
      },
    ],
  },
]

export const partnerOrders: PartnerOrder[] = [
  {
    id: 'QB-2247',
    customer: 'Rohit Sharma',
    items: '1 × Paneer Tikka Pizza, 1 × Coke',
    minutes: 2,
    amount: 498,
    stage: 'new',
  },
  {
    id: 'QB-2246',
    customer: 'Neha Iyer',
    items: '1 × Chicken Biryani, 1 × Raita',
    minutes: 3,
    amount: 349,
    stage: 'new',
  },
  {
    id: 'QB-2245',
    customer: 'Varun Menon',
    items: '2 × Veg Frankie',
    minutes: 5,
    amount: 298,
    stage: 'new',
  },
  {
    id: 'QB-2244',
    customer: 'Ananya Nair',
    items: '1 × Butter Chicken, 2 × Naan',
    minutes: 8,
    amount: 548,
    stage: 'preparing',
  },
  {
    id: 'QB-2243',
    customer: 'Karan Patel',
    items: '1 × Veg Pulao, 1 × Raita',
    minutes: 12,
    amount: 329,
    stage: 'preparing',
  },
  {
    id: 'QB-2241',
    customer: 'Megha Kulkarni',
    items: '1 × Chicken Burger, 1 × Fries',
    minutes: 22,
    amount: 299,
    stage: 'ready',
  },
]

export const adminIssues: AdminIssue[] = [
  {
    id: 'issue-1',
    type: 'Restaurant approval',
    details: 'Green Bowl Café · Malleswaram',
    status: 'Pending review',
    owner: 'Neha Sharma',
    age: '2h 15m',
  },
  {
    id: 'issue-2',
    type: 'Delayed order',
    details: 'Order #QB-78421 · Curry Leaf Kitchen',
    status: 'Delayed',
    owner: 'Rohit Verma',
    age: '45m',
  },
  {
    id: 'issue-3',
    type: 'Refund request',
    details: 'Order #QB-78302 · The Pasta Bar',
    status: 'Under review',
    owner: 'Ananya Iyer',
    age: '1h 05m',
  },
  {
    id: 'issue-4',
    type: 'Unavailable area',
    details: 'HSR Layout Sector 3 · Bengaluru',
    status: 'Service issue',
    owner: 'Vikram Singh',
    age: '3h 40m',
  },
]

export const cityAreas = [
  'Koramangala',
  'Indiranagar',
  'HSR Layout',
  'Jayanagar',
  'JP Nagar',
  'Whitefield',
]

export function restaurantById(idOrSlug?: string) {
  for (const restaurant of restaurants) {
    if (
      restaurant.id === idOrSlug ||
      restaurant.slug === idOrSlug
    ) {
      return restaurant
    }
  }

  return undefined
}

export function menuForRestaurant(restaurantId: string) {
  const matchingItems: MenuItem[] = []

  for (const item of menuItems) {
    if (item.restaurantId === restaurantId) {
      matchingItems.push(item)
    }
  }

  return matchingItems
}