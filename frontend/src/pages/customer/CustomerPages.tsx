import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  fetchRestaurantNames, fetchRestaurantById,
  type RestaurantNameApiItem, type RestaurantDetailsApiResponse
} from '../../api/restaurants'
import { Loader } from '../../components/Loader'
import {
  PiArrowLeft,
  PiArrowRight,
  PiBell,
  PiCaretDown,
  PiCaretRight,
  PiChatCircleDots,
  PiCheck,
  PiCheckCircle,
  PiClock,
  PiCopy,
  PiCookingPot,
  PiCreditCard,
  PiCrown,
  PiGift,
  PiHeart,
  PiHeartFill,
  PiHouse,
  PiInfo,
  PiLeaf,
  PiLightning,
  PiLockKey,
  PiMapPin,
  PiMinus,
  PiNavigationArrow,
  PiPackage,
  PiPersonSimpleBike,
  PiPhone,
  PiPlus,
  PiReceipt,
  PiShareNetwork,
  PiShieldCheck,
  PiShoppingBag,
  PiSlidersHorizontal,
  PiStar,
  PiStarFill,
  PiTag,
  PiTicket,
  PiTrash,
  PiTruck,
  PiUser,
  PiUsers,
  PiWallet,
} from 'react-icons/pi'
import {
  cuisineCategories,
  menuForRestaurant,
  menuItems,
  offers,
  orders,
  restaurantById,
  restaurants,
} from '../../data'
import {
  EmptyState,
  PageIntro,
  Rating,
  SearchField,
  SectionHeading,
  StatusBadge,
} from '../../components/Common'
import { useApp } from '../../context/AppContext'
import type { MenuItem, Offer, Order, OrderStatus, Restaurant } from '../../types'
import './customer.css'

type FoodPreference = 'all' | 'veg' | 'nonveg'

const currency = (value: number) => `₹${Math.max(0, Math.round(value)).toLocaleString('en-IN')}`

const humanise = (value: string) => value
  .replace(/-/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase())

function currentRestaurant(params: Record<string, string | undefined>) {
  return restaurantById(params.slug ?? params.restaurantId ?? params.id) ?? restaurants[0]
}

function statusLabel(status: OrderStatus) {
  return status.replace('_', ' ').replace(/^\w/, (letter) => letter.toUpperCase())
}

function statusTone(status: OrderStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  if (status === 'delivered') return 'success'
  if (status === 'cancelled') return 'danger'
  if (status === 'preparing' || status === 'picked_up') return 'warning'
  if (status === 'placed' || status === 'confirmed') return 'info'
  return 'neutral'
}

type RestaurantCardData = {
  id: string
  slug: string
  name: string
  image: string
  cuisines: string[]
  area: string
  rating: number
  deliveryMinutes: number
  priceForTwo: number
  offer: string
  featured: boolean
}

function RestaurantCard({
  restaurant,
  compact = false,
}: {
  restaurant: RestaurantCardData
  compact?: boolean
}) {
  const [saved, setSaved] = useState(false)
  return (
    <article className={`cp-restaurant-card ${compact ? 'cp-restaurant-card--compact' : ''}`}>
      <div className="cp-restaurant-card__media">
        <Link to={`/restaurants/${restaurant.id}`} aria-label={`Open ${restaurant.name}`}>
          <img src={restaurant.image} alt={`${restaurant.name} food`} />
        </Link>
        <strong className="cp-offer-ribbon">{restaurant.offer}</strong>
        <button
          className="cp-save-button"
          type="button"
          onClick={() => setSaved((value) => !value)}
          aria-label={saved ? `Remove ${restaurant.name} from favourites` : `Save ${restaurant.name}`}
        >
          {saved ? <PiHeartFill /> : <PiHeart />}
        </button>
      </div>
      <div className="cp-restaurant-card__body">
        <Link to={`/restaurants/${restaurant.slug}`}>
          <h3>{restaurant.name}</h3>
          <div className="cp-card-meta">
            <Rating value={restaurant.rating} />
            <span><PiClock /> {restaurant.deliveryMinutes} min</span>
          </div>
          <p>{restaurant.cuisines.join(', ')}</p>
          <small>{restaurant.area} · {currency(restaurant.priceForTwo)} for two</small>
        </Link>
      </div>
    </article>
  )
}

function RestaurantGrid({
  entries,
}: {
  entries: RestaurantCardData[]
}) {
  if (!entries.length) {
    return <EmptyState title="No restaurants found" description="Try clearing a filter or searching for another dish." />
  }
  return <div className="cp-restaurant-grid">{entries.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</div>
}

function CuisineRail() {
  return (
    <div className="cp-cuisine-rail" aria-label="Browse cuisines">
      {cuisineCategories.map((cuisine) => (
        <Link key={cuisine.name} to={`/collections/${cuisine.name.toLowerCase().replace(/\s+/g, '-')}`}>
          <img src={cuisine.image} alt="" />
          <strong>{cuisine.name}</strong>
        </Link>
      ))}
    </div>
  )
}

function PreferenceTabs({ value, onChange }: { value: FoodPreference; onChange: (value: FoodPreference) => void }) {
  return (
    <div className="cp-segmented" aria-label="Food preference">
      {(['all', 'veg', 'nonveg'] as const).map((preference) => (
        <button
          key={preference}
          className={value === preference ? 'active' : ''}
          type="button"
          onClick={() => onChange(preference)}
        >
          {preference === 'all' ? 'All' : preference === 'veg' ? 'Veg' : 'Non-veg'}
        </button>
      ))}
    </div>
  )
}

function MenuItemCard({ item, restaurant }: { item: MenuItem; restaurant: Restaurant }) {
  const { addItem, openOverlay } = useApp()
  const add = () => item.customizable
    ? openOverlay('item', { item, restaurant })
    : addItem(item, restaurant)

  return (
    <article className={`cp-menu-item ${item.soldOut ? 'cp-menu-item--sold-out' : ''}`}>
      <div className="cp-menu-item__content">
        <span className={item.veg ? 'food-marker food-marker--veg' : 'food-marker food-marker--nonveg'} />
        {item.bestseller && <span className="cp-bestseller"><PiStarFill /> Bestseller</span>}
        <h3>{item.name}</h3>
        <strong>{currency(item.price)}</strong>
        <Rating value={item.rating} count={item.ratingCount} />
        <p>{item.description}</p>
      </div>
      <div className="cp-menu-item__action">
        <img src={item.image} alt={item.name} />
        <button type="button" disabled={item.soldOut} onClick={add}>
          {item.soldOut ? 'Sold out' : 'Add'} {!item.soldOut && <PiPlus />}
        </button>
        {item.customizable && !item.soldOut && <small>Customisable</small>}
      </div>
    </article>
  )
}

function BillBreakdown({ subtotal, offer }: { subtotal: number; offer: Offer | null }) {
  const deliveryFee = subtotal >= 499 ? 0 : 39
  const taxes = Math.round(subtotal * 0.05)
  const discount = offer && subtotal >= offer.minimum ? Math.min(offer.discount, subtotal) : 0
  const total = subtotal + deliveryFee + taxes - discount
  return (
    <div className="cp-bill">
      <h3>Bill details</h3>
      <span>Item total <strong>{currency(subtotal)}</strong></span>
      <span>Delivery fee <strong>{deliveryFee ? currency(deliveryFee) : 'FREE'}</strong></span>
      <span>Taxes and charges <strong>{currency(taxes)}</strong></span>
      {discount > 0 && <span className="cp-bill__saving">Coupon discount <strong>−{currency(discount)}</strong></span>}
      <span className="cp-bill__total">To pay <strong>{currency(total)}</strong></span>
    </div>
  )
}

function AccountGate({ children }: { children: ReactNode }) {
  const { openOverlay, user } = useApp()
  if (user) return children
  return (
    <section className="cp-auth-gate">
      <PiUser />
      <h2>Sign in to continue</h2>
      <p>Your orders, saved addresses and preferences will appear here.</p>
      <button className="primary-button" type="button" onClick={() => openOverlay('auth')}>Sign in with phone</button>
    </section>
  )
}

export function RestaurantsPage() {
  const { openOverlay } = useApp()

  const [apiRestaurants, setApiRestaurants] =
    useState<RestaurantNameApiItem[]>([])

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const [fastOnly, setFastOnly] = useState(false)
  const [topRated, setTopRated] = useState(false)
  const [vegOnly, setVegOnly] = useState(false)

  const [sort, setSort] =
    useState<'relevance' | 'delivery' | 'rating'>('relevance')

  function toggleFastOnly() {
    setCurrentPage(0)
    setFastOnly((value) => !value)
  }

  function toggleTopRated() {
    setCurrentPage(0)
    setTopRated((value) => !value)
  }

  function toggleVegOnly() {
    setCurrentPage(0)
    setVegOnly((value) => !value)
  }

  useEffect(() => {
    async function loadRestaurantNames() {
      try {
        setIsLoading(true)
        const restaurantPage = await fetchRestaurantNames(currentPage, 3,
          {
            pureVeg: vegOnly,
            minimumRating: topRated ? 4.5 : undefined,
            maximumDeliveryMinutes: fastOnly ? 30 : undefined,
          },)

        setApiRestaurants(restaurantPage.items)
        setTotalPages(restaurantPage.totalPages)
      } catch (error) {
        console.error('Could not load restaurants:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRestaurantNames()
  }, [currentPage, fastOnly, topRated, vegOnly])

  const restaurantCards = useMemo(() => {
    const cards: RestaurantCardData[] = []

    for (let index = 0; index < apiRestaurants.length; index += 1) {
      const apiRestaurant = apiRestaurants[index]

      cards.push({
        id: apiRestaurant.id,
        slug: apiRestaurant.slug,
        name: apiRestaurant.name,
        image: apiRestaurant.imageUrl,
        cuisines: apiRestaurant.cuisines,
        area: apiRestaurant.area,
        rating: apiRestaurant.averageRating,
        deliveryMinutes: apiRestaurant.maximumDeliveryMinutes,
        priceForTwo: apiRestaurant.averageCostForTwo,
        offer: apiRestaurant.primaryOffer,
        featured: apiRestaurant.featured,
      })
    }

    return cards
  }, [apiRestaurants])

  const visibleRestaurants = useMemo(() => {
    return [...restaurantCards].sort((a, b) => {
      if (sort === 'delivery') {
        return a.deliveryMinutes - b.deliveryMinutes
      }

      if (sort === 'rating') {
        return b.rating - a.rating
      }

      return Number(b.featured) - Number(a.featured)
    })
  }, [restaurantCards, sort])

  return (
    <div className="cp-page cp-discovery-page">
      <section className="cp-section">
        <SectionHeading title="What are you craving?" />
        <CuisineRail />
      </section>

      <section className="cp-section">
        <SectionHeading
          title="Top picks near you"
          link="View all"
          to="/offers"
        />

        <div className="cp-promo-row">
          <Link
            to="/offers"
            className="cp-promo-card cp-promo-card--purple"
          >
            <PiTicket />

            <span>
              <small>Limited-time offers</small>
              <strong>Save up to 40% today</strong>
            </span>

            <PiArrowRight />
          </Link>

          <Link
            to="/membership"
            className="cp-promo-card cp-promo-card--mint"
          >
            <PiCrown />

            <span>
              <small>QuickBite One</small>
              <strong>Free delivery and extra savings</strong>
            </span>

            <PiArrowRight />
          </Link>

          <Link
            to="/group-order"
            className="cp-promo-card"
          >
            <PiUsers />

            <span>
              <small>Eating together?</small>
              <strong>Start a group order</strong>
            </span>

            <PiArrowRight />
          </Link>
        </div>
      </section>

      <section
        className="cp-section"
        id="all-restaurants"
      >
        <div className="cp-filter-row">
          <button
            type="button"
            onClick={() => openOverlay('filters')}
          >
            <PiSlidersHorizontal />
            All filters
          </button>

          <label className="cp-sort-select">
            Sort by

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as typeof sort)
              }}
            >
              <option value="relevance">Relevance</option>
              <option value="delivery">Delivery time</option>
              <option value="rating">Rating</option>
            </select>
          </label>

          <button
            className={fastOnly ? 'active' : ''}
            type="button"
            onClick={toggleFastOnly}
          >
            Under 30 min
          </button>

          <button
            className={topRated ? 'active' : ''}
            type="button"
            onClick={toggleTopRated}
          >
            Rated 4.5+
          </button>

          <button
            className={vegOnly ? 'active' : ''}
            type="button"
            onClick={toggleVegOnly}
          >
            <PiLeaf />
            Pure veg
          </button>
        </div>

        <SectionHeading
          title="Restaurants near you"
          link={`${visibleRestaurants.length} available`}
          to="#all-restaurants"
        />

        {isLoading ? (
          <Loader label="Loading restaurants..." size={90} />
        ) : (
          <RestaurantGrid entries={visibleRestaurants} />
        )}
        {!isLoading && totalPages > 1 && (
          <div className="cp-pagination">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              <PiArrowLeft />
              Previous
            </button>

            <span>
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
              <PiArrowRight />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') ?? '')
  const [resultType, setResultType] = useState<'restaurants' | 'dishes'>('restaurants')
  const [preference, setPreference] = useState<FoodPreference>('all')
  const [topRated, setTopRated] = useState(false)

  const normalized = query.trim().toLowerCase()
  const restaurantResults = restaurants.filter((restaurant) => {
    const matchesQuery = !normalized || [restaurant.name, ...restaurant.cuisines].some((value) => value.toLowerCase().includes(normalized))
    return matchesQuery && (!topRated || restaurant.rating >= 4.5) && (preference !== 'veg' || restaurant.pureVeg)
  })
  const dishResults = menuItems.filter((item, index) => {
    const matchesQuery = !normalized || [item.name, item.category, item.description].some((value) => value.toLowerCase().includes(normalized))
    const matchesPreference = preference === 'all' || (preference === 'veg' ? item.veg : !item.veg)
    return matchesQuery && matchesPreference && (!topRated || item.rating >= 4.5) && index < 28
  })

  const updateQuery = (value: string) => {
    setQuery(value)
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('query', value)
    else next.delete('query')
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="cp-page cp-search-page">
      <PageIntro eyebrow="Search" title={normalized ? `Results for “${query}”` : 'Find your next favourite'} description="Search nearby restaurants and dishes." />
      <div className="cp-search-hero"><SearchField value={query} onChange={updateQuery} placeholder="Search for restaurants and food" /></div>
      {!normalized && (
        <section className="cp-section">
          <SectionHeading title="Popular cuisines" />
          <CuisineRail />
        </section>
      )}
      <div className="cp-results-toolbar">
        <div className="cp-tab-list" role="tablist" aria-label="Search result type">
          <button className={resultType === 'restaurants' ? 'active' : ''} type="button" onClick={() => setResultType('restaurants')}>Restaurants <span>{restaurantResults.length}</span></button>
          <button className={resultType === 'dishes' ? 'active' : ''} type="button" onClick={() => setResultType('dishes')}>Dishes <span>{dishResults.length}</span></button>
        </div>
        <div className="cp-results-filters">
          <PreferenceTabs value={preference} onChange={setPreference} />
          <button className={topRated ? 'active' : ''} type="button" onClick={() => setTopRated((value) => !value)}><PiStar /> Rated 4.5+</button>
        </div>
      </div>
      {resultType === 'restaurants'
        ? <RestaurantGrid entries={restaurantResults} />
        : dishResults.length
          ? <div className="cp-dish-results">{dishResults.map((item) => {
            const restaurant = restaurantById(item.restaurantId) ?? restaurants[0]
            return <div key={item.id} className="cp-dish-result"><div className="cp-dish-result__restaurant"><Link to={`/restaurants/${restaurant.slug}`}>{restaurant.name}<PiCaretRight /></Link><small>{restaurant.area}</small></div><MenuItemCard item={item} restaurant={restaurant} /></div>
          })}</div>
          : <EmptyState title="No dishes found" description="Try another spelling or remove a preference filter." />}
    </div>
  )
}

export function RestaurantMenuPage() {
  const params = useParams<{ slug?: string; restaurantId?: string; id?: string }>()
  const restaurant = currentRestaurant(params)
  const [apiRestaurant, setApiRestaurant] = useState<RestaurantDetailsApiResponse | null>(null)

  useEffect(() => {
    async function loadRestaurant() {
      if (!params.restaurantId) {
        return
      }

      try {
        const restaurantResponse =
          await fetchRestaurantById(params.restaurantId)

        setApiRestaurant(restaurantResponse)
      } catch (error) {
        console.error('Could not load restaurant:', error)
      }
    }

    loadRestaurant()
  }, [params.restaurantId])

  const restaurantName = apiRestaurant?.name
  const restaurantImage = apiRestaurant?.imageUrl
  const restaurantArea = apiRestaurant?.area
  const restaurantCity = apiRestaurant?.city
  const restaurantShortDescription = apiRestaurant?.shortDescription
  const restaurantAverageRating = apiRestaurant?.averageRating ?? 0.0
  const restaurantMaxDeliveryMinutes = apiRestaurant?.maximumDeliveryMinutes
  const restaurantAverageCostForTwo = apiRestaurant?.averageCostForTwo ?? 0
  const restaurantTotalRating = apiRestaurant?.totalRatings ?? 0

  const [query, setQuery] = useState('')
  const [preference, setPreference] = useState<FoodPreference>('all')
  const [saved, setSaved] = useState(false)
  const items = menuForRestaurant(restaurant.id)
  const categories = [...new Set(items.map((item) => item.category))]
  const filtered = items.filter((item) => {
    const matchesQuery = !query.trim() || item.name.toLowerCase().includes(query.trim().toLowerCase())
    const matchesPreference = preference === 'all' || (preference === 'veg' ? item.veg : !item.veg)
    return matchesQuery && matchesPreference
  })

  return (
    <div className="cp-page cp-menu-page">
      <nav className="cp-breadcrumbs" aria-label="Breadcrumb"><Link to="/restaurants">Home</Link><PiCaretRight /><span>{restaurantName}</span></nav>
      <section className="cp-restaurant-hero">
        <img src={restaurantImage} alt={`${restaurantName} dishes`} />
        <div className="cp-restaurant-hero__content">
          <div className="cp-title-actions">
            <div><span className="eyebrow">{restaurantArea}</span><h1>{restaurantName}</h1></div>
            <button type="button" className={saved ? 'active' : ''} onClick={() => setSaved((value) => !value)}>{saved ? <PiHeartFill /> : <PiHeart />} {saved ? 'Saved' : 'Save'}</button>
          </div>
          <p>{restaurantShortDescription}</p>
          <div className="cp-restaurant-stats">
            <span><Rating value={restaurantAverageRating} count={restaurantTotalRating} /><small>Ratings</small></span>
            <span><strong>{restaurantMaxDeliveryMinutes} min</strong><small>Delivery time</small></span>
            <span><strong>{currency(restaurantAverageCostForTwo)}</strong><small>Cost for two</small></span>
          </div>
          <p className="cp-restaurant-meta"><PiMapPin /> {restaurantArea}, {restaurantCity} </p>
        </div>
      </section>

      <section className="cp-deal-strip">
        {[restaurant.offer, 'Free delivery above ₹499', 'Extra 15% with QuickBite One'].map((deal, index) => (
          <article key={deal}><span>{index === 0 ? <PiTicket /> : index === 1 ? <PiTruck /> : <PiCrown />}</span><strong>{deal}</strong><small>{index === 0 ? 'Use code QUICK40' : 'Terms apply'}</small></article>
        ))}
      </section>

      <section className="cp-menu-shell">
        <aside className="cp-menu-nav">
          <h2>Menu</h2>
          {categories.map((category) => <a key={category} href={`#menu-${category.toLowerCase().replace(/\s+/g, '-')}`}>{category}<span>{filtered.filter((item) => item.category === category).length}</span></a>)}
        </aside>
        <div className="cp-menu-content">
          <div className="cp-menu-tools">
            <SearchField value={query} onChange={setQuery} placeholder={`Search in ${restaurantName}`} />
            <PreferenceTabs value={preference} onChange={setPreference} />
          </div>
          {!filtered.length && <EmptyState title="No menu items match" description="Try clearing your search or changing the food preference." />}
          {categories.map((category) => {
            const categoryItems = filtered.filter((item) => item.category === category)
            if (!categoryItems.length) return null
            return <section key={category} id={`menu-${category.toLowerCase().replace(/\s+/g, '-')}`} className="cp-menu-category"><h2>{category} <span>{categoryItems.length} items</span></h2>{categoryItems.map((item) => <MenuItemCard key={item.id} item={item} restaurant={restaurant} />)}</section>
          })}
        </div>
      </section>
    </div>
  )
}

export function CollectionPage() {
  const params = useParams<{ collection?: string; slug?: string; id?: string }>()
  const rawCollection = params.collection ?? params.slug ?? params.id ?? 'top-rated'
  const collection = humanise(rawCollection)
  const [fastOnly, setFastOnly] = useState(false)
  const [topRated, setTopRated] = useState(rawCollection === 'top-rated')
  const [vegOnly, setVegOnly] = useState(false)
  const cuisineName = cuisineCategories.find((entry) => entry.name.toLowerCase().replace(/\s+/g, '-') === rawCollection)?.name
  const entries = restaurants.filter((restaurant) => {
    const cuisineMatch = !cuisineName || restaurant.cuisines.some((cuisine) => cuisine.toLowerCase().includes(cuisineName.toLowerCase()))
    return cuisineMatch && (!fastOnly || restaurant.deliveryMinutes <= 30) && (!topRated || restaurant.rating >= 4.5) && (!vegOnly || restaurant.pureVeg)
  })
  const heroImage = cuisineCategories.find((entry) => entry.name === cuisineName)?.image ?? '/assets/food/restaurant.jpg'

  return (
    <div className="cp-page">
      <section className="cp-collection-hero">
        <div><span className="eyebrow">Curated collection</span><h1>{collection}</h1><p>Highly rated picks, reliable delivery and offers from restaurants near you.</p></div>
        <img src={heroImage} alt={`${collection} collection`} />
      </section>
      <div className="cp-filter-row">
        <button className={fastOnly ? 'active' : ''} type="button" onClick={() => setFastOnly((value) => !value)}>Under 30 min</button>
        <button className={topRated ? 'active' : ''} type="button" onClick={() => setTopRated((value) => !value)}>Rated 4.5+</button>
        <button className={vegOnly ? 'active' : ''} type="button" onClick={() => setVegOnly((value) => !value)}>Pure veg</button>
      </div>
      <RestaurantGrid entries={entries} />
    </div>
  )
}

export function OffersPage() {
  const { appliedOffer, applyOffer } = useApp()
  return (
    <div className="cp-page">
      <PageIntro eyebrow="Offers for you" title="Big cravings, smaller bills" description="Restaurant, delivery and payment offers available around Koramangala." />
      <section className="cp-offer-grid">
        {offers.map((offer) => (
          <article key={offer.id} className="cp-offer-card">
            <span className="cp-offer-card__icon">{offer.type === 'delivery' ? <PiTruck /> : offer.type === 'payment' ? <PiCreditCard /> : <PiTicket />}</span>
            <small>{offer.type} offer</small>
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            <div><code>{offer.code}</code><button type="button" disabled={appliedOffer?.id === offer.id} onClick={() => applyOffer(offer)}>{appliedOffer?.id === offer.id ? <><PiCheck /> Applied</> : 'Apply'}</button></div>
            <button className="cp-text-button" type="button">Minimum order {currency(offer.minimum)} <PiCaretRight /></button>
          </article>
        ))}
      </section>
      <section className="cp-section">
        <SectionHeading title="Restaurants with offers" />
        <RestaurantGrid entries={restaurants.filter((restaurant) => restaurant.open).slice(0, 6)} />
      </section>
    </div>
  )
}

export function CartPage() {
  const { appliedOffer, cart, cartRestaurant, cartSubtotal, clearCart, openOverlay, updateQuantity } = useApp()
  if (!cart.length || !cartRestaurant) {
    return (
      <div className="cp-page cp-narrow-page">
        <EmptyState title="Your cart is empty" description="Add a few dishes and they will appear here." action={<Link className="primary-button" to="/restaurants">Browse restaurants</Link>} />
        <SectionHeading title="Popular near you" />
        <div className="cp-horizontal-restaurants">{restaurants.slice(0, 3).map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} compact />)}</div>
      </div>
    )
  }

  return (
    <div className="cp-page cp-checkout-page">
      <PageIntro eyebrow="Your cart" title="Review your order" description={`Ordering from ${cartRestaurant.name}`} actions={<button className="cp-text-button cp-danger-text" type="button" onClick={() => openOverlay('confirm', { title: 'Clear your cart?', description: 'All items in this cart will be removed.', confirmLabel: 'Clear cart', danger: true, onConfirm: clearCart })}><PiTrash /> Clear cart</button>} />
      <div className="cp-checkout-grid">
        <section className="cp-card cp-cart-card">
          <div className="cp-cart-restaurant"><img src={cartRestaurant.image} alt="" /><span><strong>{cartRestaurant.name}</strong><small>{cartRestaurant.area}</small></span><Link to={`/restaurants/${cartRestaurant.slug}`}>Add more items</Link></div>
          <div className="cp-cart-lines">
            {cart.map((line) => (
              <article key={`${line.id}-${line.option ?? ''}`}>
                <span className={line.veg ? 'food-marker food-marker--veg' : 'food-marker food-marker--nonveg'} />
                <div><strong>{line.name}</strong>{line.option && <small>{line.option}</small>}<span>{currency(line.price)}</span></div>
                <div className="quantity-stepper"><button type="button" onClick={() => updateQuantity(line.id, -1)} aria-label={`Remove one ${line.name}`}><PiMinus /></button><b>{line.quantity}</b><button type="button" onClick={() => updateQuantity(line.id, 1)} aria-label={`Add one ${line.name}`}><PiPlus /></button></div>
                <strong>{currency(line.price * line.quantity)}</strong>
              </article>
            ))}
          </div>
          <label className="cp-note-field"><PiReceipt /><input placeholder="Add cooking instructions for the restaurant" /></label>
          <label className="cp-check-row"><input type="checkbox" defaultChecked /><span><strong>Opt out of disposable cutlery</strong><small>A small choice for less waste.</small></span><PiLeaf /></label>
        </section>
        <aside className="cp-order-summary">
          <button className="cp-coupon-banner" type="button" onClick={() => openOverlay('coupons')}><PiTag /><span><strong>{appliedOffer ? `${appliedOffer.code} applied` : 'Apply a coupon'}</strong><small>{appliedOffer ? `Saving up to ${currency(appliedOffer.discount)}` : 'View all available offers'}</small></span><PiCaretRight /></button>
          <BillBreakdown subtotal={cartSubtotal} offer={appliedOffer} />
          <p className="cp-safety-note"><PiShieldCheck /> Safe, secure and contactless delivery supported.</p>
          <Link className="primary-button full-width" to="/checkout">Choose address & payment <PiArrowRight /></Link>
        </aside>
      </div>
    </div>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const {
    addresses: savedAddresses,
    appliedOffer,
    cart,
    cartRestaurant,
    cartSubtotal,
    clearCart,
    openOverlay,
    paymentMethod,
    selectedAddress,
    selectAddress,
    showToast,
    user,
  } = useApp()

  const placeOrder = () => {
    if (!cart.length) { showToast('Add items before placing an order'); return }
    if (!user) { openOverlay('auth'); return }
    if (!selectedAddress) { showToast('Choose a delivery address'); return }
    clearCart()
    showToast('Order placed successfully')
    navigate('/order-confirmation/QB-78491')
  }

  return (
    <div className="cp-page cp-checkout-page">
      <div className="cp-secure-heading"><Link to="/cart"><PiArrowLeft /> Back to cart</Link><span><PiLockKey /> Secure checkout</span></div>
      <div className="cp-checkout-grid">
        <div className="cp-checkout-steps">
          <section className="cp-checkout-step">
            <span className="cp-step-number">1</span>
            <div className="cp-checkout-step__body"><div className="cp-step-heading"><div><h2>Account</h2><p>{user ? `${user.name} · +91 ${user.phone}` : 'Sign in to place and manage your order.'}</p></div>{user ? <PiCheckCircle /> : <button type="button" onClick={() => openOverlay('auth')}>Sign in</button>}</div></div>
          </section>
          <section className="cp-checkout-step">
            <span className="cp-step-number">2</span>
            <div className="cp-checkout-step__body">
              <div className="cp-step-heading"><div><h2>Delivery address</h2><p>Choose where this order should arrive.</p></div><button type="button" onClick={() => openOverlay('address')}>Add new</button></div>
              <div className="cp-address-choice-grid">
                {savedAddresses.map((address) => <button key={address.id} type="button" className={selectedAddress?.id === address.id ? 'selected' : ''} onClick={() => selectAddress(address)}><span>{address.label === 'Home' ? <PiHouse /> : <PiMapPin />}</span><div><strong>{address.label}</strong><p>{address.line1}</p><small>{address.line2}</small></div>{selectedAddress?.id === address.id && <PiCheckCircle />}</button>)}
              </div>
            </div>
          </section>
          <section className="cp-checkout-step">
            <span className="cp-step-number">3</span>
            <div className="cp-checkout-step__body"><div className="cp-step-heading"><div><h2>Payment</h2><p>{paymentMethod}</p></div><button type="button" onClick={() => openOverlay('payment')}>Change</button></div><div className="cp-payment-summary"><PiWallet /><span><strong>{paymentMethod}</strong><small>Your payment details are protected.</small></span><PiShieldCheck /></div></div>
          </section>
        </div>
        <aside className="cp-order-summary cp-order-summary--sticky">
          {cartRestaurant && <div className="cp-cart-restaurant"><img src={cartRestaurant.image} alt="" /><span><small>Ordering from</small><strong>{cartRestaurant.name}</strong></span></div>}
          <div className="cp-mini-items">{cart.map((line) => <span key={`${line.id}-${line.option ?? ''}`}>{line.quantity} × {line.name}<strong>{currency(line.price * line.quantity)}</strong></span>)}</div>
          <BillBreakdown subtotal={cartSubtotal} offer={appliedOffer} />
          <button className="primary-button full-width" type="button" onClick={placeOrder}>Place order & pay <PiArrowRight /></button>
          <small className="cp-terms-note">By placing this order, you agree to the terms of service and cancellation policy.</small>
        </aside>
      </div>
    </div>
  )
}

export function OrderConfirmationPage() {
  const params = useParams<{ orderId?: string; id?: string }>()
  const orderId = params.orderId ?? params.id ?? 'QB-78491'
  const { cartRestaurant, selectedAddress } = useApp()
  const restaurant = cartRestaurant ?? restaurants[0]
  return (
    <div className="cp-page cp-confirmation-page">
      <section className="cp-confirmation-card">
        <span className="cp-success-icon"><PiCheck /></span>
        <span className="eyebrow">Order confirmed</span>
        <h1>Your meal is being prepared</h1>
        <p>{restaurant.name} has accepted your order. We will keep you updated at every step.</p>
        <div className="cp-confirmation-eta"><PiClock /><span><small>Estimated arrival</small><strong>24–30 minutes</strong></span></div>
        <div className="cp-confirmation-meta"><span>Order ID <strong>{orderId}</strong></span><span>Delivering to <strong>{selectedAddress?.label ?? 'Home'}</strong></span></div>
        <div className="cp-confirmation-actions"><Link className="primary-button" to={`/orders/${orderId}/track`}>Track order <PiArrowRight /></Link><Link className="secondary-button" to={`/orders/${orderId}`}>View order details</Link></div>
      </section>
      <p className="cp-confirmation-note"><PiBell /> Updates will also be sent to your registered phone number.</p>
    </div>
  )
}

export function OrderTrackingPage() {
  const params = useParams<{ orderId?: string; id?: string }>()
  const id = params.orderId ?? params.id ?? 'QB-78491'
  const order = orders.find((entry) => entry.id === id) ?? orders[0]
  const { openOverlay } = useApp()
  const stages = [
    { key: 'confirmed', title: 'Order confirmed', detail: 'The restaurant accepted your order.', icon: <PiCheck /> },
    { key: 'preparing', title: 'Food is being prepared', detail: 'The kitchen is preparing your items now.', icon: <PiCookingPot /> },
    { key: 'picked_up', title: 'Picked up for delivery', detail: 'Your delivery partner is heading to you.', icon: <PiPersonSimpleBike /> },
    { key: 'delivered', title: 'Delivered', detail: 'Enjoy your meal.', icon: <PiPackage /> },
  ]
  const activeIndex = order.status === 'placed' ? -1 : Math.max(0, stages.findIndex((stage) => stage.key === order.status))

  return (
    <div className="cp-page cp-tracking-page">
      <div className="cp-secure-heading"><Link to="/orders"><PiArrowLeft /> All orders</Link><span>Order {order.id}</span></div>
      <div className="cp-tracking-grid">
        <section className="cp-tracking-main">
          <div className="cp-tracking-hero"><span><PiClock /></span><div><small>Arriving in</small><h1>{order.eta ?? '24–30 min'}</h1><p>Your order from {order.restaurantName} is on schedule.</p></div></div>
          <div className="cp-delivery-journey">
            <div className="cp-map-summary"><PiNavigationArrow /><div><strong>Delivery route</strong><p>{order.restaurantName} → {order.address}</p><small>Live location appears after pickup.</small></div></div>
            <div className="cp-timeline">{stages.map((stage, index) => <article key={stage.key} className={index <= activeIndex ? 'complete' : index === activeIndex + 1 ? 'active' : ''}><span>{stage.icon}</span><div><strong>{stage.title}</strong><p>{stage.detail}</p>{index === activeIndex && <small>Current status</small>}</div></article>)}</div>
          </div>
        </section>
        <aside className="cp-tracking-aside">
          <div className="cp-card cp-delivery-person"><span><PiPersonSimpleBike /></span><div><small>Your delivery partner</small><strong>Ravi Kumar</strong><p>Verified QuickBite partner</p></div><a href="tel:+919876543210" aria-label="Call delivery partner"><PiPhone /></a></div>
          <div className="cp-card"><h3>Order summary</h3>{order.items.map((item) => <span className="cp-summary-line" key={item.name}>{item.quantity} × {item.name}<strong>{currency(item.price * item.quantity)}</strong></span>)}<span className="cp-summary-total">Total <strong>{currency(order.amount)}</strong></span></div>
          <button className="secondary-button full-width" type="button" onClick={() => openOverlay('support-chat')}><PiChatCircleDots /> Get help</button>
          {order.status !== 'picked_up' && <button className="cp-text-button cp-danger-text full-width" type="button" onClick={() => openOverlay('cancel-order', { orderId: order.id })}>Cancel order</button>}
        </aside>
      </div>
    </div>
  )
}

export function OrdersPage() {
  const [tab, setTab] = useState<'active' | 'past'>('active')
  const { addItem, openOverlay, showToast } = useApp()
  const visibleOrders = orders.filter((order) => tab === 'active' ? !['delivered', 'cancelled'].includes(order.status) : ['delivered', 'cancelled'].includes(order.status))

  const reorder = (order: Order) => {
    const restaurant = restaurantById(order.restaurantId)
    const item = restaurant && menuForRestaurant(restaurant.id)[0]
    if (restaurant && item) addItem(item, restaurant)
    else showToast('This restaurant is currently unavailable')
  }

  return (
    <AccountGate>
      <div className="cp-page cp-narrow-page">
        <PageIntro eyebrow="Your orders" title="Orders and reorders" description="Track active deliveries or revisit something you loved." />
        <div className="cp-tab-list cp-tab-list--large"><button className={tab === 'active' ? 'active' : ''} type="button" onClick={() => setTab('active')}>Active orders</button><button className={tab === 'past' ? 'active' : ''} type="button" onClick={() => setTab('past')}>Past orders</button></div>
        <div className="cp-order-list">
          {visibleOrders.map((order) => (
            <article key={order.id} className="cp-order-card">
              <img src={order.restaurantImage} alt="" />
              <div className="cp-order-card__main"><div><h2>{order.restaurantName}</h2><StatusBadge tone={statusTone(order.status)}>{statusLabel(order.status)}</StatusBadge></div><p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</p><small>{order.date} · {order.id}</small><div className="cp-order-card__actions"><Link className="secondary-button" to={`/orders/${order.id}`}>View details</Link>{tab === 'active' ? <><Link className="primary-button" to={`/orders/${order.id}/track`}>Track order</Link><button className="cp-text-button cp-danger-text" type="button" onClick={() => openOverlay('cancel-order', { orderId: order.id })}>Cancel</button></> : order.status === 'delivered' ? <><button className="primary-button" type="button" onClick={() => reorder(order)}>Reorder</button><button className="secondary-button" type="button" onClick={() => openOverlay('rating', order)}><PiStar /> Rate order</button></> : null}</div></div>
              <strong>{currency(order.amount)}</strong>
            </article>
          ))}
          {!visibleOrders.length && <EmptyState title={`No ${tab} orders`} description="Your orders will appear here when available." />}
        </div>
      </div>
    </AccountGate>
  )
}

export function OrderDetailsPage() {
  const params = useParams<{ orderId?: string; id?: string }>()
  const id = params.orderId ?? params.id ?? orders[0].id
  const order = orders.find((entry) => entry.id === id) ?? orders[0]
  const { addItem, openOverlay } = useApp()
  const restaurant = restaurantById(order.restaurantId) ?? restaurants[0]
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const reorder = () => {
    const item = menuForRestaurant(restaurant.id)[0]
    if (item) addItem(item, restaurant)
  }

  return (
    <AccountGate>
      <div className="cp-page cp-order-detail-page">
        <div className="cp-secure-heading"><Link to="/orders"><PiArrowLeft /> Back to orders</Link><StatusBadge tone={statusTone(order.status)}>{statusLabel(order.status)}</StatusBadge></div>
        <div className="cp-order-detail-grid">
          <section className="cp-card cp-order-receipt">
            <div className="cp-receipt-restaurant"><img src={order.restaurantImage} alt="" /><div><span className="eyebrow">Order {order.id}</span><h1>{order.restaurantName}</h1><p>{order.date}</p></div></div>
            <div className="cp-receipt-items"><h2>Items</h2>{order.items.map((item) => <span key={item.name}><b>{item.quantity}</b><div><strong>{item.name}</strong><small>Regular</small></div><strong>{currency(item.price * item.quantity)}</strong></span>)}</div>
            <div className="cp-receipt-bill"><span>Item total <strong>{currency(subtotal)}</strong></span><span>Taxes and delivery <strong>{currency(Math.max(0, order.amount - subtotal))}</strong></span><span>Total paid <strong>{currency(order.amount)}</strong></span></div>
          </section>
          <aside className="cp-order-detail-aside">
            <section className="cp-card"><h3><PiMapPin /> Delivered to</h3><strong>Home</strong><p>{order.address}</p></section>
            <section className="cp-card"><h3><PiCreditCard /> Payment</h3><p>UPI · Paid securely</p></section>
            <section className="cp-card cp-action-stack">{!['delivered', 'cancelled'].includes(order.status) && <Link className="primary-button full-width" to={`/orders/${order.id}/track`}>Track order</Link>}{order.status === 'delivered' && <><button className="primary-button full-width" type="button" onClick={reorder}>Reorder items</button><button className="secondary-button full-width" type="button" onClick={() => openOverlay('rating', order)}><PiStar /> Rate your order</button></>}<Link className="secondary-button full-width" to={`/help/orders/${order.id}`}><PiChatCircleDots /> Get help with this order</Link>{!['delivered', 'cancelled', 'picked_up'].includes(order.status) && <button className="cp-text-button cp-danger-text full-width" type="button" onClick={() => openOverlay('cancel-order', { orderId: order.id })}>Cancel order</button>}</section>
          </aside>
        </div>
      </div>
    </AccountGate>
  )
}

export function AccountPage() {
  const { openOverlay, signOut, user } = useApp()
  const menu = [
    { to: '/orders', icon: <PiShoppingBag />, title: 'Your orders', detail: 'Track, reorder and get help' },
    { to: '/account/addresses', icon: <PiMapPin />, title: 'Saved addresses', detail: 'Manage delivery locations' },
    { to: '/account/favourites', icon: <PiHeart />, title: 'Favourites', detail: 'Restaurants you saved' },
    { to: '/membership', icon: <PiCrown />, title: 'QuickBite One', detail: 'Membership and savings' },
    { to: '/help', icon: <PiHeadsetIcon />, title: 'Help and support', detail: 'FAQs and live chat' },
  ]
  return (
    <AccountGate>
      <div className="cp-page cp-account-page">
        <section className="cp-profile-card"><span className="cp-profile-avatar">{user?.name.slice(0, 1)}</span><div><span className="eyebrow">Your account</span><h1>{user?.name}</h1><p>+91 {user?.phone} · gourab@example.com</p></div><button className="secondary-button" type="button" onClick={() => openOverlay('confirm', { title: 'Update profile?', description: 'Profile editing will use your verified phone number.', confirmLabel: 'Continue', onConfirm: () => undefined })}>Edit profile</button></section>
        <div className="cp-account-grid">
          {menu.map((item) => <Link key={item.to} to={item.to}><span>{item.icon}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div><PiCaretRight /></Link>)}
        </div>
        <section className="cp-card cp-preference-card"><div><PiBell /><span><strong>Order updates</strong><small>SMS and push notifications are enabled</small></span></div><button type="button" onClick={() => openOverlay('confirm', { title: 'Change notifications?', description: 'You can keep essential delivery updates and turn off promotional messages.', confirmLabel: 'Update preferences' })}>Manage</button></section>
        <button className="cp-signout-button" type="button" onClick={() => openOverlay('confirm', { title: 'Sign out of QuickBite?', description: 'Your cart stays on this device, but saved account details will be hidden.', confirmLabel: 'Sign out', danger: true, onConfirm: signOut })}>Sign out</button>
      </div>
    </AccountGate>
  )
}

function PiHeadsetIcon() { return <PiChatCircleDots /> }

export function AddressesPage() {
  const { addresses: savedAddresses, deleteAddress, openOverlay, selectedAddress, selectAddress } = useApp()
  return (
    <AccountGate>
      <div className="cp-page cp-narrow-page">
        <PageIntro eyebrow="Account" title="Saved addresses" description="Choose a default delivery address or add a new one." actions={<button className="primary-button" type="button" onClick={() => openOverlay('address')}><PiPlus /> Add address</button>} />
        <div className="cp-address-list">
          {savedAddresses.map((address) => <article key={address.id} className={selectedAddress?.id === address.id ? 'selected' : ''}><span className="cp-address-icon">{address.label === 'Home' ? <PiHouse /> : <PiMapPin />}</span><div><div><h2>{address.label}</h2>{selectedAddress?.id === address.id && <StatusBadge tone="success">Default</StatusBadge>}</div><p>{address.line1}</p><small>{address.line2}</small>{address.instructions && <small>Note: {address.instructions}</small>}<div className="cp-address-actions"><button type="button" onClick={() => selectAddress(address)}>Set as default</button><button type="button" onClick={() => openOverlay('address', address)}>Edit</button><button className="cp-danger-text" type="button" onClick={() => openOverlay('confirm', { title: `Remove ${address.label} address?`, description: 'You will need to add it again before using it for delivery.', confirmLabel: 'Remove address', danger: true, onConfirm: () => deleteAddress(address.id) })}>Delete</button></div></div></article>)}
        </div>
      </div>
    </AccountGate>
  )
}

export function FavouritesPage() {
  const [favourites, setFavourites] = useState(restaurants.filter((restaurant) => restaurant.featured || restaurant.pureVeg).slice(0, 5))
  return (
    <AccountGate>
      <div className="cp-page">
        <PageIntro eyebrow="Saved for later" title="Favourite restaurants" description="Your go-to kitchens, ready when hunger strikes." />
        {favourites.length ? <div className="cp-restaurant-grid">{favourites.map((restaurant) => <div key={restaurant.id} className="cp-favourite-wrap"><RestaurantCard restaurant={restaurant} /><button type="button" onClick={() => setFavourites((entries) => entries.filter((entry) => entry.id !== restaurant.id))}><PiHeartFill /> Remove from favourites</button></div>)}</div> : <EmptyState title="No favourites yet" description="Tap the heart on a restaurant to find it quickly next time." action={<Link className="primary-button" to="/restaurants">Explore restaurants</Link>} />}
      </div>
    </AccountGate>
  )
}

const helpGroups = [
  { icon: <PiShoppingBag />, title: 'Orders and delivery', text: 'Tracking, delays and order changes' },
  { icon: <PiWallet />, title: 'Payments and refunds', text: 'Payment methods, refunds and charges' },
  { icon: <PiUser />, title: 'Account and login', text: 'Profile, phone number and security' },
  { icon: <PiTicket />, title: 'Offers and membership', text: 'Coupons and QuickBite One benefits' },
]

const faqs = [
  ['Where is my order?', 'Open Your orders and choose Track order to see the latest ETA and delivery status.'],
  ['Can I change an order after placing it?', 'Items cannot be changed after restaurant confirmation. Contact support quickly and we will check available options.'],
  ['When will my refund arrive?', 'Approved refunds usually reach the original payment method in five to seven working days.'],
  ['Why did my coupon not apply?', 'Check the minimum order, restaurant eligibility, expiry date and supported payment method.'],
]

export function HelpPage() {
  const { openOverlay } = useApp()
  const [query, setQuery] = useState('')
  const visibleFaqs = faqs.filter(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <div className="cp-page cp-help-page">
      <section className="cp-help-hero"><span className="eyebrow">QuickBite support</span><h1>How can we help?</h1><SearchField value={query} onChange={setQuery} placeholder="Search help topics" /></section>
      <section className="cp-help-grid">{helpGroups.map((group) => <button type="button" key={group.title}><span>{group.icon}</span><div><strong>{group.title}</strong><small>{group.text}</small></div><PiCaretRight /></button>)}</section>
      <div className="cp-help-columns">
        <section><SectionHeading title="Frequently asked questions" /> <div className="cp-faq-list">{visibleFaqs.map(([question, answer]) => <details key={question}><summary>{question}<PiCaretDown /></summary><p>{answer}</p></details>)}{!visibleFaqs.length && <EmptyState title="No matching help topic" description="Try a shorter search or chat with support." />}</div></section>
        <aside className="cp-card cp-chat-card"><PiChatCircleDots /><h2>Need more help?</h2><p>Chat with support for order, payment or account questions.</p><button className="primary-button full-width" type="button" onClick={() => openOverlay('support-chat')}>Start live chat</button><small>Typical response time: under 2 minutes</small></aside>
      </div>
    </div>
  )
}

export function OrderHelpPage() {
  const params = useParams<{ orderId?: string; id?: string }>()
  const id = params.orderId ?? params.id ?? orders[0].id
  const order = orders.find((entry) => entry.id === id) ?? orders[0]
  const { openOverlay, showToast } = useApp()
  const issues = ['Order is delayed', 'Missing or incorrect item', 'Food quality issue', 'Payment or refund issue']
  return (
    <div className="cp-page cp-narrow-page">
      <div className="cp-secure-heading"><Link to={`/orders/${order.id}`}><PiArrowLeft /> Order details</Link><span>Help for {order.id}</span></div>
      <section className="cp-order-help-summary"><img src={order.restaurantImage} alt="" /><div><h1>{order.restaurantName}</h1><p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</p><small>{order.date}</small></div><StatusBadge tone={statusTone(order.status)}>{statusLabel(order.status)}</StatusBadge></section>
      <section className="cp-help-issue-list"><h2>What do you need help with?</h2>{issues.map((issue) => <button type="button" key={issue} onClick={() => showToast(`${issue} selected`)}><span><PiInfo /></span>{issue}<PiCaretRight /></button>)}</section>
      <section className="cp-card cp-inline-support"><div><PiChatCircleDots /><span><strong>Still need help?</strong><small>Share the details with our support team.</small></span></div><button className="primary-button" type="button" onClick={() => openOverlay('support-chat')}>Chat with us</button></section>
    </div>
  )
}

export function DineoutPage() {
  const dineoutRestaurants = restaurants.filter((restaurant) => restaurant.dineout)
  const [date, setDate] = useState('2026-08-30')
  const [guests, setGuests] = useState('2')
  return (
    <div className="cp-page cp-dineout-page">
      <section className="cp-dineout-hero"><div><span className="eyebrow">QuickBite Dineout</span><h1>Make a meal of going out</h1><p>Discover dining offers and reserve a table in a few simple steps.</p><form><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Guests<select value={guests} onChange={(event) => setGuests(event.target.value)}><option value="2">2 guests</option><option value="4">4 guests</option><option value="6">6 guests</option></select></label><button className="primary-button" type="button">Find a table</button></form></div><img src="/assets/food/restaurant.jpg" alt="Restaurant dining room" /></section>
      <section className="cp-section"><SectionHeading title="Popular restaurants for dining out" /> <div className="cp-dineout-grid">{dineoutRestaurants.map((restaurant) => <article key={restaurant.id}><Link to={`/dineout/${restaurant.slug}`}><div className="cp-dineout-media"><img src={restaurant.image} alt={`${restaurant.name} dining`} /><strong>Up to 25% off bill</strong></div><div><h2>{restaurant.name}</h2><Rating value={restaurant.rating} count={restaurant.ratingCount} /><p>{restaurant.cuisines.join(', ')}</p><small>{restaurant.area} · {currency(restaurant.priceForTwo)} for two</small><span>Reserve a table <PiArrowRight /></span></div></Link></article>)}</div></section>
    </div>
  )
}

export function DineoutDetailPage() {
  const params = useParams<{ slug?: string; restaurantId?: string; id?: string }>()
  const selected = currentRestaurant(params)
  const restaurant = selected.dineout ? selected : restaurants.find((entry) => entry.dineout) ?? selected
  const { openOverlay, showToast } = useApp()
  const [date, setDate] = useState('2026-08-30')
  const [time, setTime] = useState('19:30')
  const [guests, setGuests] = useState('2')
  const reserve = (event: FormEvent) => { event.preventDefault(); showToast(`Table request sent to ${restaurant.name}`) }
  return (
    <div className="cp-page cp-dineout-detail">
      <nav className="cp-breadcrumbs"><Link to="/dineout">Dineout</Link><PiCaretRight /><span>{restaurant.name}</span></nav>
      <section className="cp-dineout-cover"><img src={restaurant.image} alt={`${restaurant.name} restaurant`} /><div><span className="eyebrow">Dineout partner</span><h1>{restaurant.name}</h1><p>{restaurant.cuisines.join(', ')} · {restaurant.area}</p><div><Rating value={restaurant.rating} count={restaurant.ratingCount} /><span>{currency(restaurant.priceForTwo)} for two</span></div></div></section>
      <div className="cp-dineout-detail-grid">
        <section className="cp-dineout-info"><article className="cp-card"><h2>About this restaurant</h2><p>{restaurant.description} Enjoy relaxed table service, a welcoming ambience and a menu built for sharing.</p><div className="cp-amenities"><span><PiCheckCircle /> Indoor seating</span><span><PiCheckCircle /> Family friendly</span><span><PiCheckCircle /> Digital payments</span></div></article><article className="cp-card"><h2>Dining offer</h2><div className="cp-dining-offer"><PiGift /><div><strong>25% off the total bill</strong><p>Valid on reservations for two or more guests.</p><small>Maximum discount ₹500 · Terms apply</small></div></div></article><article className="cp-card"><h2>Location and hours</h2><p><PiMapPin /> {restaurant.area}, {restaurant.city}</p><p><PiClock /> Open today · 12:00 PM to 11:00 PM</p></article></section>
        <aside className="cp-reservation-card"><span className="eyebrow">Reserve a table</span><h2>Plan your visit</h2><form onSubmit={reserve}><label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Time<select value={time} onChange={(event) => setTime(event.target.value)}><option>19:00</option><option>19:30</option><option>20:00</option><option>20:30</option></select></label><label>Guests<select value={guests} onChange={(event) => setGuests(event.target.value)}><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="6">6 guests</option></select></label><button className="primary-button full-width" type="submit">Request reservation</button></form><button className="cp-text-button full-width" type="button" onClick={() => openOverlay('support-chat')}><PiPhone /> Contact restaurant support</button></aside>
      </div>
    </div>
  )
}

export function MembershipPage() {
  const { openOverlay, showToast } = useApp()
  const benefits = [
    { icon: <PiTruck />, title: 'Unlimited free delivery', text: 'On eligible restaurant orders above ₹199.' },
    { icon: <PiTicket />, title: 'Extra member offers', text: 'Stack member-only savings on selected restaurants.' },
    { icon: <PiLightning />, title: 'Priority delivery', text: 'Faster assignment during busy meal hours.' },
    { icon: <PiGift />, title: 'Dineout rewards', text: 'Extra benefits when you reserve eligible tables.' },
  ]
  const join = () => openOverlay('confirm', { title: 'Join QuickBite One?', description: 'Your three-month plan costs ₹149. You can review payment before activation.', confirmLabel: 'Continue to payment', onConfirm: () => showToast('Membership added to checkout') })
  return (
    <div className="cp-page cp-membership-page">
      <section className="cp-membership-hero"><div><span className="cp-membership-badge"><PiCrown /> QuickBite One</span><h1>More favourites. Fewer delivery fees.</h1><p>Unlock free delivery, exclusive offers and priority benefits across QuickBite.</p><div className="cp-membership-price"><strong>₹149</strong><span>for 3 months<small>Less than ₹2 a day</small></span></div><button className="primary-button" type="button" onClick={join}>Join QuickBite One <PiArrowRight /></button></div><div className="cp-membership-card"><PiCrown /><span>MEMBER</span><strong>QUICKBITE ONE</strong><small>Gourab Pal · Valid for 3 months</small></div></section>
      <section className="cp-benefit-grid">{benefits.map((benefit) => <article key={benefit.title}><span>{benefit.icon}</span><h2>{benefit.title}</h2><p>{benefit.text}</p></article>)}</section>
      <section className="cp-savings-card"><div><span className="eyebrow">Estimated savings</span><h2>Membership can pay for itself in three orders</h2><p>Based on two deliveries and one member offer each month.</p></div><div><span>Delivery savings <strong>₹270</strong></span><span>Member offers <strong>₹180</strong></span><span>Potential 3-month savings <strong>₹450</strong></span></div></section>
      <section className="cp-membership-faq"><SectionHeading title="Membership questions" /><details><summary>Which restaurants are eligible?<PiCaretDown /></summary><p>Eligible restaurants show the QuickBite One badge on their cards and menus.</p></details><details><summary>Can I cancel the membership?<PiCaretDown /></summary><p>You can turn off renewal at any time from your account.</p></details></section>
    </div>
  )
}

export function GroupOrderPage() {
  const { openOverlay, showToast } = useApp()
  const [started, setStarted] = useState(false)
  const restaurant = restaurants[2]
  const groupItems = menuForRestaurant(restaurant.id).slice(0, 4)
  const shareCode = 'QB-GROUP-4821'
  const copyCode = () => {
    void navigator.clipboard?.writeText(shareCode)
    showToast('Group order link copied')
  }
  return (
    <div className="cp-page cp-group-page">
      {!started ? <section className="cp-group-setup"><div><span className="cp-group-icon"><PiUsers /></span><span className="eyebrow">Group ordering</span><h1>One cart for the whole group</h1><p>Share a link, let everyone add their own dishes, then review and place one order together.</p><div className="cp-group-steps"><span><b>1</b>Choose a restaurant</span><span><b>2</b>Share the invite</span><span><b>3</b>Place one order</span></div><button className="primary-button" type="button" onClick={() => setStarted(true)}>Start a group order <PiArrowRight /></button></div><img src="/assets/food/pizza.jpg" alt="Pizza ready to share" /></section> : <>
        <section className="cp-group-toolbar"><div><span className="eyebrow">Group order is open</span><h1>{restaurant.name}</h1><p>You are the host · 2 people joined</p></div><button className="secondary-button" type="button" onClick={copyCode}><PiShareNetwork /> Share invite</button></section>
        <section className="cp-group-invite"><div><PiUsers /><span><strong>Invite friends to add their food</strong><small>Anyone with this code can join until you lock the cart.</small></span></div><code>{shareCode}</code><button type="button" onClick={copyCode} aria-label="Copy group code"><PiCopy /></button></section>
        <div className="cp-group-grid"><section><SectionHeading title="Popular picks for the group" />{groupItems.map((item) => <MenuItemCard key={item.id} item={item} restaurant={restaurant} />)}</section><aside className="cp-card cp-group-members"><h2>People in this order</h2><span><b>GP</b><div><strong>Gourab</strong><small>Host · 1 item</small></div><PiCheckCircle /></span><span><b>AS</b><div><strong>Ananya</strong><small>2 items</small></div><PiCheckCircle /></span><button className="primary-button full-width" type="button" onClick={() => openOverlay('confirm', { title: 'Lock the group cart?', description: 'Members will no longer be able to add or edit items.', confirmLabel: 'Lock and review', onConfirm: () => showToast('Group cart locked') })}>Lock cart and review</button></aside></div>
      </>}
    </div>
  )
}