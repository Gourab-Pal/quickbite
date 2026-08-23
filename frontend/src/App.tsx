import { useMemo, useState } from 'react'
import './App.css'

type Restaurant = {
  id: number
  name: string
  cuisine: string
  description: string
  rating: number
  deliveryTime: string
  priceForTwo: string
  offer: string
  emoji: string
  visual: string
  featured: boolean
}

const cuisineFilters = [
  'All',
  'Biryani',
  'Pizza',
  'South Indian',
  'Healthy',
  'Desserts',
]

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Meghana Foods',
    cuisine: 'Biryani · Andhra',
    description: 'Fiery biryanis, kebabs and comforting Andhra favourites.',
    rating: 4.7,
    deliveryTime: '25–30 min',
    priceForTwo: '₹500 for two',
    offer: '20% OFF',
    emoji: '🍛',
    visual: 'linear-gradient(135deg, #312e81, #8b7cff)',
    featured: true,
  },
  {
    id: 2,
    name: 'Brik Oven',
    cuisine: 'Pizza · Italian',
    description: 'Hand-stretched sourdough pizzas from a wood-fired oven.',
    rating: 4.6,
    deliveryTime: '30–35 min',
    priceForTwo: '₹700 for two',
    offer: 'FREE DELIVERY',
    emoji: '🍕',
    visual: 'linear-gradient(135deg, #134e4a, #2dd4bf)',
    featured: true,
  },
  {
    id: 3,
    name: 'Taaza Thindi',
    cuisine: 'South Indian',
    description: 'Crisp dosas, soft idlis and freshly brewed filter coffee.',
    rating: 4.8,
    deliveryTime: '20–25 min',
    priceForTwo: '₹250 for two',
    offer: '15% OFF',
    emoji: '🥞',
    visual: 'linear-gradient(135deg, #1e3a8a, #38bdf8)',
    featured: false,
  },
  {
    id: 4,
    name: 'Green Theory',
    cuisine: 'Healthy · Continental',
    description: 'Fresh bowls, salads and wholesome plant-forward meals.',
    rating: 4.5,
    deliveryTime: '25–35 min',
    priceForTwo: '₹600 for two',
    offer: '10% OFF',
    emoji: '🥗',
    visual: 'linear-gradient(135deg, #14532d, #84cc16)',
    featured: false,
  },
  {
    id: 5,
    name: 'Corner House',
    cuisine: 'Desserts · Ice Cream',
    description: 'Iconic sundaes, rich chocolate sauces and frozen treats.',
    rating: 4.7,
    deliveryTime: '20–30 min',
    priceForTwo: '₹350 for two',
    offer: 'BUY 1 GET 1',
    emoji: '🍨',
    visual: 'linear-gradient(135deg, #4c1d95, #c084fc)',
    featured: true,
  },
  {
    id: 6,
    name: 'Burma Burma',
    cuisine: 'Asian · Burmese',
    description: 'Modern Burmese food with bold flavours and comforting bowls.',
    rating: 4.6,
    deliveryTime: '35–40 min',
    priceForTwo: '₹900 for two',
    offer: '₹150 OFF',
    emoji: '🍜',
    visual: 'linear-gradient(135deg, #164e63, #22d3ee)',
    featured: false,
  },
]

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All')

  const visibleRestaurants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return restaurants.filter((restaurant) => {
      const matchesCuisine =
          selectedCuisine === 'All' ||
          restaurant.cuisine
              .toLowerCase()
              .includes(selectedCuisine.toLowerCase())

      const matchesSearch =
          query.length === 0 ||
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query) ||
          restaurant.description.toLowerCase().includes(query)

      return matchesCuisine && matchesSearch
    })
  }, [searchQuery, selectedCuisine])

  return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <a className="brand" href="/" aria-label="QuickBite home">
              <span className="brand-mark">Q</span>
              <span>QuickBite</span>
            </a>

            <button className="location-button" type="button">
              <span className="location-icon">⌖</span>

              <span>
              <small>Delivering to</small>
              <strong>Koramangala, Bengaluru</strong>
            </span>

              <span aria-hidden="true">⌄</span>
            </button>

            <nav className="header-actions" aria-label="Main navigation">
              <button className="text-button" type="button">
                Sign in
              </button>

              <button className="cart-button" type="button">
                <span>Cart</span>
                <span className="cart-count">2</span>
              </button>
            </nav>
          </div>
        </header>

        <main className="page-content">
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">Fresh picks · delivered fast</span>

              <h1>
                Your next favourite meal is
                <span> closer than you think.</span>
              </h1>

              <p>
                Discover standout restaurants, neighbourhood favourites and
                dishes worth craving.
              </p>

              <label className="search-box">
              <span className="search-icon" aria-hidden="true">
                ⌕
              </span>

                <input
                    type="search"
                    placeholder="Search restaurants, dishes or cuisines"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />

                <button type="button">Find food</button>
              </label>

              <div className="hero-highlights">
                <span>⚡ Average delivery in 28 minutes</span>
                <span>● Live restaurant availability</span>
              </div>
            </div>

            <aside className="hero-order-card">
              <div className="order-card-heading">
                <div>
                  <small>YOUR DINNER PLAN</small>
                  <h2>Comfort food night</h2>
                </div>

                <span className="live-badge">LIVE</span>
              </div>

              <div className="order-item">
                <span className="order-item-icon">🍛</span>

                <span>
                <strong>Boneless biryani</strong>
                <small>Meghana Foods</small>
              </span>

                <strong>₹345</strong>
              </div>

              <div className="order-item">
                <span className="order-item-icon">🥤</span>

                <span>
                <strong>Fresh lime soda</strong>
                <small>Perfectly chilled</small>
              </span>

                <strong>₹65</strong>
              </div>

              <div className="order-total">
              <span>
                <small>Delivery in</small>
                <strong>26 minutes</strong>
              </span>

                <button type="button">View cart · ₹410</button>
              </div>
            </aside>
          </section>

          <section className="restaurant-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">CURATED NEAR YOU</span>
                <h2>Restaurants worth ordering from</h2>
              </div>

              <p>{visibleRestaurants.length} places available</p>
            </div>

            <div className="filter-row">
              {cuisineFilters.map((cuisine) => (
                  <button
                      className={selectedCuisine === cuisine ? 'active' : ''}
                      key={cuisine}
                      type="button"
                      onClick={() => setSelectedCuisine(cuisine)}
                  >
                    {cuisine}
                  </button>
              ))}
            </div>

            {visibleRestaurants.length > 0 ? (
                <div className="restaurant-grid">
                  {visibleRestaurants.map((restaurant) => (
                      <article className="restaurant-card" key={restaurant.id}>
                        <div
                            className="restaurant-visual"
                            style={{ background: restaurant.visual }}
                        >
                          <span className="food-emoji">{restaurant.emoji}</span>
                          <span className="offer-badge">{restaurant.offer}</span>

                          {restaurant.featured && (
                              <span className="featured-badge">FEATURED</span>
                          )}
                        </div>

                        <div className="restaurant-details">
                          <div className="restaurant-title">
                            <div>
                              <h3>{restaurant.name}</h3>
                              <p>{restaurant.cuisine}</p>
                            </div>

                            <span className="rating">★ {restaurant.rating}</span>
                          </div>

                          <p className="restaurant-description">
                            {restaurant.description}
                          </p>

                          <div className="restaurant-meta">
                            <span>◷ {restaurant.deliveryTime}</span>
                            <span>{restaurant.priceForTwo}</span>
                          </div>

                          <button className="menu-button" type="button">
                            View menu
                            <span aria-hidden="true">→</span>
                          </button>
                        </div>
                      </article>
                  ))}
                </div>
            ) : (
                <div className="empty-state">
                  <span>🍽️</span>
                  <h3>No restaurants found</h3>
                  <p>Try another restaurant name or cuisine.</p>
                </div>
            )}
          </section>
        </main>

        <footer className="app-footer">
          <div>
            <a className="brand footer-brand" href="/">
              <span className="brand-mark">Q</span>
              <span>QuickBite</span>
            </a>

            <p>Good food, minus the wait.</p>
          </div>

          <span>Built in Bengaluru · © 2026 QuickBite</span>
        </footer>
      </div>
  )
}

export default App