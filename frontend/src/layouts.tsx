import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  PiArrowRight,
  PiBriefcase,
  PiCaretDown,
  PiChartLineUp,
  PiForkKnife,
  PiGear,
  PiHeadset,
  PiHouse,
  PiListBullets,
  PiMagnifyingGlass,
  PiMapPin,
  PiMegaphone,
  PiMoney,
  PiNotepad,
  PiReceipt,
  PiShoppingBag,
  PiSignOut,
  PiStar,
  PiStorefront,
  PiTicket,
  PiUser,
  PiUsers,
  PiWallet,
} from 'react-icons/pi'
import { Logo } from './components/Common'
import { CartSummaryLink } from './components/Overlays'
import { useApp } from './context/AppContext'

export function CustomerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const { cartCount, openOverlay, selectedLocation, user } = useApp()

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    navigate(`/search${query.trim() ? `?query=${encodeURIComponent(query.trim())}` : ''}`)
  }

  return (
    <div className="customer-shell">
      <header className="customer-header">
        <div className="customer-header__inner">
          <Link to="/" className="customer-header__brand" aria-label="QuickBite home"><Logo /></Link>
          <button className="location-button" type="button" onClick={() => openOverlay('location')}>
            <PiMapPin /><span>{selectedLocation}</span><PiCaretDown />
          </button>
          <form className="customer-search" onSubmit={submitSearch}>
            <PiMagnifyingGlass />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search restaurants or dishes" />
          </form>
          <nav className="customer-nav" aria-label="Customer navigation">
            <NavLink to="/offers"><PiTicket /> <span>Offers</span></NavLink>
            <NavLink to="/help"><PiHeadset /> <span>Help</span></NavLink>
            <button className="account-button" type="button" aria-label={user ? `Open ${user.name}'s account` : 'Sign in'} onClick={() => user ? navigate('/account') : openOverlay('auth')}>
              <PiUser /> <span>{user?.name ?? 'Sign in'}</span>
            </button>
            <button className="cart-button" type="button" aria-label={cartCount > 0 ? `Cart with ${cartCount} item${cartCount === 1 ? '' : 's'}` : 'Cart'} onClick={() => openOverlay('cart')}>
              <PiShoppingBag /><span>Cart</span>{cartCount > 0 && <b>{cartCount}</b>}
            </button>
          </nav>
        </div>
      </header>
      <main className={`customer-main customer-main--${location.pathname === '/restaurants' ? 'wide' : 'standard'}`}>
        <Outlet />
      </main>
      <CartSummaryLink />
      <CustomerFooter />
    </div>
  )
}

export function CustomerFooter() {
  return (
    <footer className="customer-footer">
      <div className="customer-footer__grid">
        <div><Logo /><p>Great food from local restaurants, delivered fresh to your door.</p></div>
        <FooterColumn title="QuickBite" links={[['About', '/about'], ['Careers', '/careers'], ['Restaurant partner', '/partner'], ['Delivery partner', '/delivery-partner']]} />
        <FooterColumn title="Discover" links={[['Restaurants', '/restaurants'], ['Offers', '/offers'], ['Dineout', '/dineout'], ['Membership', '/membership']]} />
        <FooterColumn title="Support" links={[['Help & FAQs', '/help'], ['Contact us', '/contact'], ['Track order', '/orders/QB-78491/track'], ['Refunds', '/refunds']]} />
        <FooterColumn title="Legal" links={[['Terms', '/terms'], ['Privacy', '/privacy'], ['Refund policy', '/refunds'], ['Cookie policy', '/privacy#cookies']]} />
      </div>
      <div className="customer-footer__bottom">© 2026 QuickBite. All rights reserved.</div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return <div className="footer-column"><h3>{title}</h3>{links.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}</div>
}

const partnerNav = [
  ['/partner/dashboard', 'Overview', PiHouse], ['/partner/orders', 'Live orders', PiShoppingBag],
  ['/partner/menu', 'Menu', PiForkKnife], ['/partner/availability', 'Availability', PiStorefront],
  ['/partner/offers', 'Offers', PiTicket], ['/partner/analytics', 'Analytics', PiChartLineUp],
  ['/partner/payouts', 'Payouts', PiWallet], ['/partner/reviews', 'Reviews', PiStar],
  ['/partner/profile', 'Outlet profile', PiBriefcase], ['/partner/support', 'Support', PiHeadset],
] as const

const adminNav = [
  ['/admin', 'Overview', PiHouse], ['/admin/restaurants', 'Restaurants', PiStorefront],
  ['/admin/orders', 'Orders', PiShoppingBag], ['/admin/users', 'Customers', PiUsers],
  ['/admin/service-areas', 'Service areas', PiMapPin], ['/admin/promotions', 'Promotions', PiMegaphone],
  ['/admin/refunds', 'Refunds', PiMoney], ['/admin/content', 'Content', PiNotepad],
  ['/admin/support', 'Support', PiHeadset], ['/admin/roles', 'Roles & access', PiUser],
  ['/admin/audit-logs', 'Audit logs', PiListBullets], ['/admin/settings', 'Settings', PiGear],
] as const

export function PortalLayout({ type }: { type: 'partner' | 'admin' }) {
  const nav = type === 'partner' ? partnerNav : adminNav
  return (
    <div className={`portal-shell portal-shell--${type}`}>
      <aside className="portal-sidebar">
        <Link to={type === 'partner' ? '/partner/dashboard' : '/admin'} className="portal-brand">
          <Logo /><small>{type === 'partner' ? 'Partner' : 'Admin'}</small>
        </Link>
        <nav aria-label={`${type} navigation`}>
          {nav.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/admin'}><Icon /><span>{label}</span></NavLink>)}
        </nav>
        <div className="portal-profile">
          <img src="/assets/people/restaurant-partner.jpg" alt="Profile" />
          <span><strong>{type === 'partner' ? 'Arjun Rao' : 'Aarav Mehta'}</strong><small>{type === 'partner' ? 'Spice Story Cafe' : 'Operations admin'}</small></span>
          <PiSignOut />
        </div>
      </aside>
      <section className="portal-main">
        <header className="portal-topbar">
          <div>
            <strong>{type === 'partner' ? 'Spice Story Cafe' : 'QuickBite operations'}</strong>
            <small>{type === 'partner' ? 'Koramangala, Bengaluru' : '29 August 2026'}</small>
          </div>
          <div className="portal-topbar__actions">
            <button type="button"><PiMagnifyingGlass /> Search</button>
            <button type="button"><PiReceipt /> Reports</button>
          </div>
        </header>
        <div className="portal-content"><Outlet /></div>
      </section>
    </div>
  )
}

export function MarketingPage({ children }: { children: ReactNode }) {
  return <div className="marketing-page"><CustomerLayoutFrame>{children}</CustomerLayoutFrame></div>
}

function CustomerLayoutFrame({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function MarketingHeader() {
  const { openOverlay } = useApp()
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand-link"><Logo /></Link>
        <nav className="main-nav"><Link to="/#services">Services</Link><Link to="/partner">Partner with us</Link><Link to="/about">About</Link><Link to="/help">Help</Link></nav>
        <div className="header-actions"><button className="sign-in-button" type="button" onClick={() => openOverlay('auth')}>Sign in</button><Link className="order-button" to="/restaurants">Order food</Link></div>
      </div>
    </header>
  )
}

export function MarketingFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand"><Link to="/" className="brand-link"><Logo /></Link><p>Great food from local restaurants, delivered fresh to your door.</p></div>
        <FooterColumn title="QuickBite" links={[['Services', '/#services'], ['Partner with us', '/partner'], ['About', '/about'], ['Careers', '/careers']]} />
        <FooterColumn title="Support" links={[['Help & FAQs', '/help'], ['Contact us', '/contact'], ['Restaurant support', '/partner/support'], ['Track your order', '/orders/QB-78491/track']]} />
        <FooterColumn title="Legal" links={[['Terms of service', '/terms'], ['Privacy policy', '/privacy'], ['Refund policy', '/refunds'], ['Cookie policy', '/privacy#cookies']]} />
        <div className="footer-column footer-contact"><h3>Get in touch</h3><a href="mailto:hello@quickbite.com">hello@quickbite.com</a><span>1800-123-4567</span><span>Mon–Sun: 8 AM – 11 PM</span></div>
      </div>
      <div className="footer-bottom">© 2026 QuickBite. All rights reserved.</div>
    </footer>
  )
}

export function InlineLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link className="inline-link" to={to}>{children} <PiArrowRight /></Link>
}