import {
  PiArrowRight,
  PiChartLineUp,
  PiClock,
  PiHeadset,
  PiLightning,
  PiShieldCheck,
  PiStarFill,
  PiStorefront,
} from 'react-icons/pi'
import './App.css'

function Logo() {
  return (
      <span className="brand-logo" aria-label="QuickBite">
      <img
          className="brand-mark-image"
          src="/assets/quickbite-logo-45.png"
          alt=""
          aria-hidden="true"
      />

      <span className="brand-name">
        Quick<span>Bite</span>
      </span>
    </span>
  )
}

function App() {
  return (
      <div className="app-shell">
        <header className="site-header">
          <div className="header-inner">
            <a href="/" className="brand-link">
              <Logo />
            </a>

            <nav className="main-nav" aria-label="Main navigation">
              <a href="#services">Services</a>
              <a href="#partner">Partner with us</a>
              <a href="#about">About</a>
              <a href="#help">Help</a>
            </nav>

            <div className="header-actions">
              <button className="sign-in-button" type="button">
                Sign in
              </button>

              <a className="order-button" href="/restaurant">
                Order food
              </a>
            </div>
          </div>
        </header>

        <main>
          <section className="hero-section">
            <div className="hero-inner">
              <div className="hero-copy">
              <span className="eyebrow">
                Your neighbourhood, delivered
              </span>

                <h1>
                  Great food.
                  <br />
                  Right when you want it.
                </h1>

                <p>
                  Discover neighbourhood restaurants and get your favourites
                  delivered fresh, fast and exactly when you need them.
                </p>

                <div className="hero-actions">
                  <a className="primary-cta" href="/restaurant">
                    Explore restaurants <PiArrowRight />
                  </a>

                  <a className="secondary-cta" href="#partner">
                    Grow with QuickBite
                  </a>
                </div>

                <div className="hero-stats">
                  <div>
                    <strong>100+</strong>
                    <span>restaurants</span>
                  </div>

                  <div>
                    <strong>30 min</strong>
                    <span>average delivery</span>
                  </div>

                  <div>
                    <strong>4.8/5</strong>
                    <span>customer rating</span>
                  </div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="hero-image-wrap">
                  <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=88"
                      alt="Freshly baked vegetable pizza"
                  />
                </div>

                <div className="floating-card delivery-time-card">
                <span className="floating-icon mint-icon">
                  <PiClock />
                </span>

                  <span>
                  <strong>24 min</strong>
                  <small>Lightning delivery</small>
                </span>
                </div>

                <div className="floating-card rating-card">
                <span className="floating-icon purple-icon">
                  <PiStarFill />
                </span>

                  <span>
                  <strong>4.9</strong>
                  <small>Customer rating</small>
                </span>
                </div>
              </div>
            </div>
          </section>

          <section className="services-section" id="services">
            <div className="section-heading">
              <span>Everything in one place</span>

              <h2>What brings you to QuickBite?</h2>

              <p>
                One platform for customers, restaurant partners and the people
                keeping every order moving.
              </p>
            </div>

            <div className="service-grid">
              <a className="service-card food-service" href="/restaurant">
                <div className="service-copy">
                <span className="service-icon">
                  <PiLightning />
                </span>

                  <h3>Food delivery</h3>

                  <p>
                    Order from your favourite restaurants and get it delivered
                    fast.
                  </p>

                  <span className="service-link">
                  Browse restaurants <PiArrowRight />
                </span>
                </div>

                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=86"
                    alt="A table filled with delicious food"
                />
              </a>

              <a
                  className="service-card partner-service"
                  href="/partner"
                  id="partner"
              >
                <div className="service-copy">
                <span className="service-icon">
                  <PiStorefront />
                </span>

                  <h3>Restaurant partner</h3>

                  <p>
                    Reach more customers and grow your business with QuickBite.
                  </p>

                  <span className="service-link">
                  Become a partner <PiArrowRight />
                </span>
                </div>

                <img
                    src="/assets/restaurant-partner.png"
                    alt="Smiling restaurant owner standing confidently in his kitchen"
                />
              </a>

              <a className="service-card admin-service" href="/admin">
                <div className="service-copy">
                <span className="service-icon">
                  <PiChartLineUp />
                </span>

                  <h3>Admin control</h3>

                  <p>
                    Manage restaurants, availability and operations in one place.
                  </p>

                  <span className="service-link">
                  Open dashboard <PiArrowRight />
                </span>
                </div>

                <div className="dashboard-preview" aria-hidden="true">
                  <div className="dashboard-sidebar">
                    <strong>Q</strong>
                    <i />
                    <i />
                    <i />
                  </div>

                  <div className="dashboard-content">
                    <small>Overview</small>

                    <div className="dashboard-metrics">
                      <div>
                        <span>Total orders</span>
                        <strong>1,245</strong>
                        <small>+18%</small>
                      </div>

                      <div>
                        <span>Revenue</span>
                        <strong>₹2.4L</strong>
                        <small>+12%</small>
                      </div>
                    </div>

                    <div className="dashboard-chart">
                      <i style={{ height: '34%' }} />
                      <i style={{ height: '52%' }} />
                      <i style={{ height: '43%' }} />
                      <i style={{ height: '68%' }} />
                      <i style={{ height: '58%' }} />
                      <i style={{ height: '84%' }} />
                      <i style={{ height: '74%' }} />
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </section>

          <section className="promise-section" id="about">
            <article>
            <span className="promise-icon purple-icon">
              <PiLightning />
            </span>

              <div>
                <h3>Fast delivery</h3>
                <p>Quick doorstep delivery, every time.</p>
              </div>
            </article>

            <article>
            <span className="promise-icon mint-icon">
              <PiShieldCheck />
            </span>

              <div>
                <h3>Safe &amp; reliable</h3>
                <p>Trusted restaurants and dependable service.</p>
              </div>
            </article>

            <article>
            <span className="promise-icon purple-icon">
              <PiHeadset />
            </span>

              <div>
                <h3>Always here for you</h3>
                <p>Helpful support whenever you need us.</p>
              </div>
            </article>
          </section>
        </main>

        <footer className="site-footer" id="help">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="brand-link">
                <Logo />
              </a>

              <p>
                Great food from local restaurants, delivered fresh to your door.
              </p>
            </div>

            <div className="footer-column">
              <h3>QuickBite</h3>
              <a href="#services">Services</a>
              <a href="#partner">Partner with us</a>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
            </div>

            <div className="footer-column">
              <h3>Support</h3>
              <a href="#help">Help &amp; FAQs</a>
              <a href="#contact">Contact us</a>
              <a href="#restaurant-support">Restaurant support</a>
              <a href="#track-order">Track your order</a>
            </div>

            <div className="footer-column">
              <h3>Legal</h3>
              <a href="#terms">Terms of service</a>
              <a href="#privacy">Privacy policy</a>
              <a href="#refund">Refund policy</a>
              <a href="#cookies">Cookie policy</a>
            </div>

            <div className="footer-column footer-contact">
              <h3>Get in touch</h3>
              <a href="mailto:hello@quickbite.com">
                hello@quickbite.com
              </a>
              <span>1800-123-4567</span>
              <span>Mon–Sun: 8 AM – 11 PM</span>
            </div>
          </div>

          <div className="footer-bottom">
            © 2026 QuickBite. All rights reserved.
          </div>
        </footer>
      </div>
  )
}

export default App