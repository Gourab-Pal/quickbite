import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  PiPulse,
  PiArrowLeft,
  PiArrowRight,
  PiBell,
  PiCalendarBlank,
  PiCaretDown,
  PiChartLineUp,
  PiCheck,
  PiCheckCircle,
  PiClock,
  PiCurrencyInr,
  PiDownloadSimple,
  PiEnvelopeSimple,
  PiEye,
  PiEyeSlash,
  PiFileText,
  PiGear,
  PiGlobe,
  PiHeadset,
  PiInfo,
  PiLockKey,
  PiMapPin,
  PiMegaphone,
  PiMoney,
  PiPackage,
  PiPhone,
  PiPlus,
  PiShieldCheck,
  PiShoppingBag,
  PiStorefront,
  PiTag,
  PiToggleLeft,
  PiToggleRight,
  PiTrendDown,
  PiTrendUp,
  PiUser,
  PiUserCircle,
  PiUserGear,
  PiUsers,
  PiWarning,
  PiX,
} from 'react-icons/pi'
import {
  MetricCard,
  PageIntro,
  SearchField,
  StatusBadge,
} from '../../components/Common'
import { useApp } from '../../context/AppContext'
import {
  adminIssues,
  cityAreas,
  menuItems,
  offers,
  orders,
  restaurantById,
  restaurants,
} from '../../data'
import type { AdminIssue, Offer, OrderStatus } from '../../types'
import './admin.css'

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
const PiActivity = PiPulse

function AdminPanel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`admin-panel ${className}`.trim()}>{children}</section>
}

function PanelHeading({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <header className="admin-panel__heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  )
}

function AdminTable({ children }: { children: ReactNode }) {
  return <div className="admin-table-wrap"><table className="admin-table">{children}</table></div>
}

function AdminToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      className={`admin-toggle ${checked ? 'admin-toggle--on' : ''}`}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
    >
      {checked ? <PiToggleRight /> : <PiToggleLeft />}
      <span>{label}</span>
    </button>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <label className="admin-select">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
      <PiCaretDown />
    </label>
  )
}

function AdminToolbar({ children }: { children: ReactNode }) {
  return <div className="admin-toolbar">{children}</div>
}

function EmptyRows({ columns, message }: { columns: number; message: string }) {
  return <tr><td className="admin-table__empty" colSpan={columns}>{message}</td></tr>
}

function toneForStatus(status: string): BadgeTone {
  const normalized = status.toLowerCase()
  if (['live', 'active', 'approved', 'paid', 'resolved', 'delivered', 'healthy', 'published', 'completed', 'verified'].some((label) => normalized.includes(label))) return 'success'
  if (['pending', 'review', 'preparing', 'scheduled', 'medium', 'warning'].some((label) => normalized.includes(label))) return 'warning'
  if (['suspended', 'rejected', 'failed', 'cancelled', 'blocked', 'critical', 'high', 'offline'].some((label) => normalized.includes(label))) return 'danger'
  if (['processing', 'assigned', 'picked', 'draft', 'new', 'open'].some((label) => normalized.includes(label))) return 'info'
  return 'neutral'
}

function Trend({ value, positive = true }: { value: string; positive?: boolean }) {
  return (
    <span className={`admin-trend ${positive ? 'admin-trend--up' : 'admin-trend--down'}`}>
      {positive ? <PiTrendUp /> : <PiTrendDown />}{value}
    </span>
  )
}

function BarChart({
  values,
  labels,
}: {
  values: number[]
  labels: string[]
}) {
  return (
    <div className="admin-bar-chart" role="img" aria-label="Order volume over the last seven days">
      {values.map((value, index) => (
        <div className="admin-bar-chart__column" key={labels[index]}>
          <span className="admin-bar-chart__value">{value}</span>
          <div className="admin-bar-chart__track"><i style={{ height: `${Math.max(12, Math.round((value / Math.max(...values)) * 100))}%` }} /></div>
          <small>{labels[index]}</small>
        </div>
      ))}
    </div>
  )
}

const overviewMetrics = [
  { label: 'Gross order value', value: '₹18.42L', change: '+12.8% vs last week', icon: <PiCurrencyInr /> },
  { label: 'Orders today', value: '2,846', change: '+8.4% vs yesterday', icon: <PiShoppingBag /> },
  { label: 'Active restaurants', value: '1,284', change: '96.2% online', icon: <PiStorefront /> },
  { label: 'Open support cases', value: '38', change: '11 need attention', icon: <PiHeadset /> },
]

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [email, setEmail] = useState('aarav.mehta@quickbite.com')
  const [password, setPassword] = useState('quickbite-admin')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('Operations admin')
  const [remember, setRemember] = useState(true)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    showToast(`Signed in as ${role}`)
    navigate('/admin')
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-card__brand">
          <span className="admin-login-card__mark"><PiShieldCheck /></span>
          <span className="admin-kicker">QuickBite operations</span>
          <h1>Keep every order moving.</h1>
          <p>Monitor restaurants, customers, payments and service health from one secure workspace.</p>
          <ul>
            <li><PiCheckCircle /><span><strong>Live operational signals</strong><small>Clear queues, alerts and service-area health.</small></span></li>
            <li><PiCheckCircle /><span><strong>Role-based controls</strong><small>Every sensitive action is permissioned and logged.</small></span></li>
            <li><PiCheckCircle /><span><strong>Customer-first decisions</strong><small>Resolve exceptions without losing order context.</small></span></li>
          </ul>
        </div>
        <div className="admin-login-card__form">
          <span className="admin-login-icon"><PiLockKey /></span>
          <h2>Admin sign in</h2>
          <p>Use your QuickBite operations account.</p>
          <form onSubmit={submit}>
            <label className="admin-field">
              <span>Work email</span>
              <div className="admin-input-icon"><PiEnvelopeSimple /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            </label>
            <label className="admin-field">
              <span>Password</span>
              <div className="admin-input-icon admin-input-icon--action">
                <PiLockKey />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
                <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <PiEyeSlash /> : <PiEye />}</button>
              </div>
            </label>
            <label className="admin-field">
              <span>Workspace role</span>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option>Operations admin</option>
                <option>Support lead</option>
                <option>Finance reviewer</option>
                <option>Content manager</option>
              </select>
            </label>
            <div className="admin-login-options">
              <label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /> Keep me signed in</label>
              <button type="button" onClick={() => showToast('Password reset instructions sent')}>Forgot password?</button>
            </div>
            <button className="admin-button admin-button--primary admin-button--full" type="submit">Sign in securely <PiArrowRight /></button>
          </form>
          <p className="admin-login-card__notice"><PiInfo /> Access is restricted to authorised QuickBite team members. Sign-in attempts are recorded.</p>
        </div>
      </section>
    </main>
  )
}

export function AdminOverviewPage() {
  const { showToast } = useApp()
  const [issues, setIssues] = useState(adminIssues)

  const updateIssue = (id: string, resolved: boolean) => {
    setIssues((current) => current.map((issue) => issue.id === id
      ? { ...issue, status: resolved ? 'Pending review' : 'Under review', owner: resolved ? 'Resolved' : 'Aarav Mehta' }
      : issue))
    showToast(resolved ? 'Issue marked resolved' : 'Issue assigned to you')
  }

  return (
    <div className="admin-page">
      <PageIntro eyebrow="Operations control" title="Good afternoon, Aarav" description="Here is what needs attention across QuickBite today." actions={<button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Operations report downloaded')}><PiDownloadSimple /> Export report</button>} />
      <div className="admin-metric-grid">
        {overviewMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="admin-overview-grid">
        <AdminPanel className="admin-overview-chart">
          <PanelHeading title="Order volume" description="Completed orders · 23–29 August" action={<div className="admin-chart-total"><strong>17,408</strong><Trend value="10.6%" /></div>} />
          <BarChart values={[2130, 2264, 2458, 2396, 2712, 2602, 2846]} labels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today']} />
        </AdminPanel>
        <AdminPanel>
          <PanelHeading title="Service health" description="Live platform and city signals" />
          <div className="admin-health-list">
            {[
              ['Ordering API', 'Healthy', '99.99%', 99],
              ['Restaurant availability', 'Healthy', '96.2%', 96],
              ['Delivery assignment', 'Warning', '91.8%', 92],
              ['Payments', 'Healthy', '99.7%', 99],
            ].map(([label, status, value, progress]) => (
              <div key={label as string}>
                <span><strong>{label}</strong><StatusBadge tone={toneForStatus(status as string)}>{status}</StatusBadge></span>
                <div className="admin-progress"><i style={{ width: `${progress}%` }} /></div>
                <small>{value} success rate</small>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="admin-overview-grid admin-overview-grid--bottom">
        <AdminPanel>
          <PanelHeading title="Priority queue" description="Exceptions ordered by customer impact" action={<Link className="admin-inline-link" to="/admin/support">Open support queue <PiArrowRight /></Link>} />
          <AdminTable>
            <thead><tr><th>Issue</th><th>Status</th><th>Owner</th><th>Age</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td><strong>{issue.type}</strong><small>{issue.details}</small></td>
                  <td><StatusBadge tone={toneForStatus(issue.status)}>{issue.status}</StatusBadge></td>
                  <td>{issue.owner}</td><td>{issue.age}</td>
                  <td className="admin-table__actions">
                    <button type="button" onClick={() => updateIssue(issue.id, false)}>Assign</button>
                    <button type="button" onClick={() => updateIssue(issue.id, true)}>Resolve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </AdminPanel>
        <AdminPanel>
          <PanelHeading title="City demand" description="Orders and active supply today" />
          <div className="admin-city-list">
            {[
              ['Koramangala', '624 orders', '182 live outlets', 92],
              ['Indiranagar', '518 orders', '149 live outlets', 84],
              ['HSR Layout', '447 orders', '131 live outlets', 76],
              ['Whitefield', '402 orders', '124 live outlets', 68],
            ].map(([area, volume, supply, width]) => (
              <article key={area as string}>
                <span><PiMapPin /><strong>{area}</strong><small>{volume}</small></span>
                <div className="admin-progress"><i style={{ width: `${width}%` }} /></div>
                <small>{supply}</small>
              </article>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  )
}

type RestaurantAdminStatus = 'Live' | 'Offline' | 'Pending review' | 'Suspended'
type RestaurantRow = {
  id: string
  status: RestaurantAdminStatus
  compliance: 'Verified' | 'Expires soon' | 'Missing document'
  orders: number
  owner: string
}

const restaurantRowsSeed: RestaurantRow[] = restaurants.map((restaurant, index) => ({
  id: restaurant.id,
  status: index === 5 ? 'Pending review' : restaurant.open ? 'Live' : 'Offline',
  compliance: index === 6 ? 'Missing document' : index === 3 ? 'Expires soon' : 'Verified',
  orders: [284, 246, 219, 188, 164, 92, 137, 201, 146][index] ?? 80,
  owner: ['R. Reddy', 'Meera Khan', 'Kunal Arora', 'Nisha Shah', 'Arjun Patel', 'Alisha Roy', 'Ravi Jain', 'Sneha Rao', 'Thomas Paul'][index] ?? 'Partner owner',
}))

export function AdminRestaurantsPage() {
  const { showToast } = useApp()
  const [rows, setRows] = useState(restaurantRowsSeed)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [city, setCity] = useState('All cities')

  const visible = useMemo(() => rows.filter((row) => {
    const restaurant = restaurantById(row.id)
    if (!restaurant) return false
    const matchesQuery = `${restaurant.name} ${restaurant.area} ${row.owner}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === 'All statuses' || row.status === status
    const matchesCity = city === 'All cities' || restaurant.city === city
    return matchesQuery && matchesStatus && matchesCity
  }), [city, query, rows, status])

  const setRestaurantStatus = (id: string, next: RestaurantAdminStatus) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, status: next } : row))
    showToast(`Restaurant status changed to ${next}`)
  }

  return (
    <div className="admin-page">
      <PageIntro eyebrow="Marketplace" title="Restaurants" description="Review onboarding, monitor live availability and protect catalogue quality." actions={<><button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Restaurant list exported')}><PiDownloadSimple /> Export</button><button className="admin-button admin-button--primary" type="button" onClick={() => showToast('Partner invite created')}><PiPlus /> Invite partner</button></>} />
      <div className="admin-summary-strip">
        <span><strong>1,284</strong><small>approved</small></span><span><strong>1,196</strong><small>live now</small></span><span><strong>23</strong><small>pending review</small></span><span><strong>17</strong><small>compliance alerts</small></span>
      </div>
      <AdminPanel>
        <AdminToolbar>
          <SearchField value={query} onChange={setQuery} placeholder="Search restaurant, area or owner" />
          <FilterSelect label="Filter by status" value={status} onChange={setStatus}><option>All statuses</option><option>Live</option><option>Offline</option><option>Pending review</option><option>Suspended</option></FilterSelect>
          <FilterSelect label="Filter by city" value={city} onChange={setCity}><option>All cities</option><option>Bengaluru</option></FilterSelect>
        </AdminToolbar>
        <AdminTable>
          <thead><tr><th>Restaurant</th><th>Status</th><th>Owner</th><th>Compliance</th><th>Orders today</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {visible.length === 0 && <EmptyRows columns={6} message="No restaurants match these filters." />}
            {visible.map((row) => {
              const restaurant = restaurantById(row.id)
              if (!restaurant) return null
              return (
                <tr key={row.id}>
                  <td><div className="admin-entity"><img src={restaurant.image} alt="" /><span><strong>{restaurant.name}</strong><small>{restaurant.area} · {restaurant.cuisines.slice(0, 2).join(', ')}</small></span></div></td>
                  <td><StatusBadge tone={toneForStatus(row.status)}>{row.status}</StatusBadge></td>
                  <td>{row.owner}</td>
                  <td><StatusBadge tone={toneForStatus(row.compliance)}>{row.compliance}</StatusBadge></td>
                  <td><strong>{row.orders}</strong></td>
                  <td className="admin-table__actions">
                    <Link to={`/admin/restaurants/${row.id}`}>View</Link>
                    {row.status === 'Pending review' ? <button type="button" onClick={() => setRestaurantStatus(row.id, 'Live')}>Approve</button> : <button type="button" onClick={() => setRestaurantStatus(row.id, row.status === 'Live' ? 'Offline' : 'Live')}>{row.status === 'Live' ? 'Pause' : 'Activate'}</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </AdminTable>
        <footer className="admin-table-footer"><span>Showing {visible.length} of {rows.length} restaurants</span><div><button type="button" disabled>Previous</button><button type="button">Next</button></div></footer>
      </AdminPanel>
    </div>
  )
}

export function AdminRestaurantDetailPage() {
  const { restaurantId } = useParams()
  const { showToast } = useApp()
  const restaurant = restaurantById(restaurantId) ?? restaurants[0]
  const [tab, setTab] = useState<'Overview' | 'Menu quality' | 'Compliance' | 'Orders'>('Overview')
  const [live, setLive] = useState(restaurant.open)
  const [verified, setVerified] = useState(true)
  const restaurantMenu = menuItems.filter((item) => item.restaurantId === restaurant.id).slice(0, 5)

  return (
    <div className="admin-page">
      <Link className="admin-back-link" to="/admin/restaurants"><PiArrowLeft /> Back to restaurants</Link>
      <div className="admin-restaurant-hero">
        <img src={restaurant.image} alt="" />
        <div><span className="admin-kicker">Restaurant ID · {restaurant.id}</span><h1>{restaurant.name}</h1><p>{restaurant.area}, {restaurant.city} · {restaurant.cuisines.join(', ')}</p><div><StatusBadge tone={live ? 'success' : 'danger'}>{live ? 'Live' : 'Offline'}</StatusBadge><StatusBadge tone={verified ? 'success' : 'warning'}>{verified ? 'Compliance verified' : 'Review required'}</StatusBadge></div></div>
        <div className="admin-restaurant-hero__actions"><AdminToggle checked={live} onChange={(next) => { setLive(next); showToast(next ? 'Restaurant activated' : 'Restaurant paused') }} label={live ? 'Accepting orders' : 'Orders paused'} /><button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Partner message window opened')}><PiEnvelopeSimple /> Contact partner</button></div>
      </div>
      <nav className="admin-tabs" aria-label="Restaurant details">
        {(['Overview', 'Menu quality', 'Compliance', 'Orders'] as const).map((label) => <button key={label} className={tab === label ? 'active' : ''} type="button" onClick={() => setTab(label)}>{label}</button>)}
      </nav>

      {tab === 'Overview' && (
        <>
          <div className="admin-metric-grid admin-metric-grid--compact">
            <MetricCard label="Orders today" value="284" change="+14.2% vs Friday" icon={<PiShoppingBag />} />
            <MetricCard label="Gross sales" value="₹1.18L" change="₹416 average order" icon={<PiCurrencyInr />} />
            <MetricCard label="Acceptance" value="98.4%" change="Within target" icon={<PiCheckCircle />} />
            <MetricCard label="Customer rating" value={restaurant.rating.toFixed(1)} change={`${restaurant.ratingCount} ratings`} icon={<PiChartLineUp />} />
          </div>
          <div className="admin-two-column">
            <AdminPanel><PanelHeading title="Outlet profile" description="Customer-facing information" /><dl className="admin-definition-list"><div><dt>Owner</dt><dd>Rohan Reddy</dd></div><div><dt>Registered phone</dt><dd>+91 98765 42010</dd></div><div><dt>Average delivery</dt><dd>{restaurant.deliveryMinutes} minutes</dd></div><div><dt>Price for two</dt><dd>₹{restaurant.priceForTwo}</dd></div><div><dt>Service area</dt><dd>{restaurant.area}</dd></div><div><dt>Commission plan</dt><dd>Growth · 22%</dd></div></dl></AdminPanel>
            <AdminPanel><PanelHeading title="Operational quality" description="Last 30 days" /><div className="admin-quality-list">{[['Order accuracy', 97], ['On-time preparation', 93], ['Menu availability', 89], ['Customer satisfaction', 95]].map(([label, score]) => <div key={label as string}><span><strong>{label}</strong><b>{score}%</b></span><div className="admin-progress"><i style={{ width: `${score}%` }} /></div></div>)}</div></AdminPanel>
          </div>
        </>
      )}

      {tab === 'Menu quality' && <AdminPanel><PanelHeading title="Menu quality review" description="High-impact items and catalogue signals" action={<button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Menu audit requested')}><PiFileText /> Request audit</button>} /><AdminTable><thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Rating</th><th>Availability</th></tr></thead><tbody>{restaurantMenu.map((item) => <tr key={item.id}><td><div className="admin-entity"><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>{item.description}</small></span></div></td><td>{item.category}</td><td>₹{item.price}</td><td>{item.rating.toFixed(1)}</td><td><StatusBadge tone={item.soldOut ? 'danger' : 'success'}>{item.soldOut ? 'Sold out' : 'Available'}</StatusBadge></td></tr>)}</tbody></AdminTable></AdminPanel>}

      {tab === 'Compliance' && <div className="admin-two-column"><AdminPanel><PanelHeading title="Business documents" description="Verification and expiry status" /><div className="admin-document-list">{[['FSSAI licence', 'Verified', '18 Jan 2027'], ['GSTIN certificate', 'Verified', 'No expiry'], ['PAN verification', 'Verified', 'No expiry'], ['Bank account proof', 'Verified', 'Reviewed 12 Aug'], ['Fire safety certificate', verified ? 'Expires soon' : 'Review required', '14 Sep 2026']].map(([name, status, date]) => <article key={name}><span><PiFileText /><span><strong>{name}</strong><small>{date}</small></span></span><StatusBadge tone={toneForStatus(status)}>{status}</StatusBadge></article>)}</div></AdminPanel><AdminPanel><PanelHeading title="Review controls" description="Record an operational decision" /><div className="admin-callout admin-callout--warning"><PiWarning /><div><strong>One document expires in 16 days</strong><p>Ask the partner for a renewed fire safety certificate before 14 September.</p></div></div><label className="admin-field"><span>Internal note</span><textarea defaultValue="Partner contacted on 29 Aug. Renewal expected within five business days." /></label><button className="admin-button admin-button--primary" type="button" onClick={() => { setVerified(false); showToast('Compliance review saved') }}>Save review</button></AdminPanel></div>}

      {tab === 'Orders' && <AdminPanel><PanelHeading title="Recent orders" description="Latest customer transactions for this restaurant" /><AdminTable><thead><tr><th>Order</th><th>Placed</th><th>Items</th><th>Amount</th><th>Status</th></tr></thead><tbody>{orders.slice(0, 4).map((order, index) => <tr key={order.id}><td><Link to={`/admin/orders?order=${order.id}`}><strong>{order.id}</strong></Link></td><td>{['Today, 1:24 PM', 'Today, 12:52 PM', 'Today, 12:18 PM', 'Today, 11:46 AM'][index]}</td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</td><td>₹{order.amount}</td><td><StatusBadge tone={toneForStatus(order.status)}>{order.status.replace('_', ' ')}</StatusBadge></td></tr>)}</tbody></AdminTable></AdminPanel>}
    </div>
  )
}

type AdminOrderStage = OrderStatus | 'payment_failed' | 'refunded'
type AdminOrderRow = {
  id: string
  customer: string
  restaurant: string
  city: string
  amount: number
  placed: string
  status: AdminOrderStage
}

const adminOrderSeed: AdminOrderRow[] = [
  ...orders.map((order, index) => ({ id: order.id, customer: ['Gourab Pal', 'Aditi Rao', 'Nikhil Sharma', 'Meera Joseph'][index], restaurant: order.restaurantName, city: 'Bengaluru', amount: order.amount, placed: order.date, status: order.status })),
  { id: 'QB-78492', customer: 'Rahul Nair', restaurant: 'Biryani Blues', city: 'Bengaluru', amount: 742, placed: '29 Aug 2026, 1:28 PM', status: 'confirmed' },
  { id: 'QB-78490', customer: 'Sara Thomas', restaurant: 'Green Theory', city: 'Bengaluru', amount: 486, placed: '29 Aug 2026, 1:18 PM', status: 'payment_failed' },
  { id: 'QB-78488', customer: 'Kunal Shah', restaurant: 'Corner House', city: 'Bengaluru', amount: 328, placed: '29 Aug 2026, 1:09 PM', status: 'picked_up' },
  { id: 'QB-78472', customer: 'Divya Rao', restaurant: 'Burger Yard', city: 'Bengaluru', amount: 519, placed: '29 Aug 2026, 12:31 PM', status: 'refunded' },
]

export function AdminOrdersPage() {
  const { showToast } = useApp()
  const [rows, setRows] = useState(adminOrderSeed)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')

  const visible = useMemo(() => rows.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.restaurant}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'All statuses' || order.status === status)
  }), [query, rows, status])

  const updateStatus = (id: string, next: AdminOrderStage) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, status: next } : row))
    showToast(`Order ${id} updated`)
  }

  return (
    <div className="admin-page">
      <PageIntro eyebrow="Order operations" title="Orders" description="Trace every transaction, delivery handoff and payment exception." actions={<button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Order report downloaded')}><PiDownloadSimple /> Export orders</button>} />
      <div className="admin-metric-grid admin-metric-grid--compact"><MetricCard label="Orders today" value="2,846" change="2,702 completed" icon={<PiPackage />} /><MetricCard label="In progress" value="126" change="18 delayed" icon={<PiClock />} /><MetricCard label="Cancelled" value="31" change="1.1% cancellation" icon={<PiX />} /><MetricCard label="Payment exceptions" value="14" change="₹8,420 at risk" icon={<PiWarning />} /></div>
      <AdminPanel>
        <AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search order, customer or restaurant" /><FilterSelect label="Filter by order status" value={status} onChange={setStatus}><option>All statuses</option><option value="placed">Placed</option><option value="confirmed">Confirmed</option><option value="preparing">Preparing</option><option value="picked_up">Picked up</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option><option value="payment_failed">Payment failed</option><option value="refunded">Refunded</option></FilterSelect></AdminToolbar>
        <AdminTable><thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Placed</th><th>Amount</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.length === 0 && <EmptyRows columns={7} message="No orders match these filters." />}{visible.map((order) => <tr key={order.id}><td><strong>{order.id}</strong><small>{order.city}</small></td><td>{order.customer}</td><td>{order.restaurant}</td><td>{order.placed}</td><td><strong>₹{order.amount}</strong></td><td><StatusBadge tone={toneForStatus(order.status)}>{order.status.replace('_', ' ')}</StatusBadge></td><td className="admin-table__actions"><button type="button" onClick={() => showToast(`Opened ${order.id}`)}>Inspect</button>{['placed', 'confirmed', 'preparing'].includes(order.status) && <button type="button" onClick={() => updateStatus(order.id, 'delivered')}>Resolve</button>}{order.status === 'payment_failed' && <button type="button" onClick={() => updateStatus(order.id, 'refunded')}>Refund</button>}</td></tr>)}</tbody></AdminTable>
        <footer className="admin-table-footer"><span>{visible.length} orders shown</span><div><button type="button" disabled>Previous</button><button type="button">Next</button></div></footer>
      </AdminPanel>
    </div>
  )
}

type CustomerStatus = 'Active' | 'Blocked' | 'Review'
type CustomerRow = { id: string; name: string; phone: string; city: string; orders: number; spend: string; joined: string; status: CustomerStatus }
const customerSeed: CustomerRow[] = [
  { id: 'USR-10482', name: 'Gourab Pal', phone: '+91 98765 40118', city: 'Bengaluru', orders: 38, spend: '₹18,420', joined: '12 Jan 2026', status: 'Active' },
  { id: 'USR-10391', name: 'Aditi Rao', phone: '+91 98451 33704', city: 'Bengaluru', orders: 24, spend: '₹11,840', joined: '04 Feb 2026', status: 'Active' },
  { id: 'USR-10217', name: 'Nikhil Sharma', phone: '+91 99864 57129', city: 'Bengaluru', orders: 19, spend: '₹8,972', joined: '21 Mar 2026', status: 'Review' },
  { id: 'USR-10188', name: 'Meera Joseph', phone: '+91 99001 28475', city: 'Bengaluru', orders: 31, spend: '₹14,210', joined: '02 Apr 2026', status: 'Active' },
  { id: 'USR-10074', name: 'Rahul Nair', phone: '+91 96118 45216', city: 'Bengaluru', orders: 7, spend: '₹2,846', joined: '18 Jun 2026', status: 'Blocked' },
  { id: 'USR-10042', name: 'Sara Thomas', phone: '+91 97412 96004', city: 'Bengaluru', orders: 12, spend: '₹5,114', joined: '01 Jul 2026', status: 'Active' },
]

export function AdminUsersPage() {
  const { showToast } = useApp()
  const [users, setUsers] = useState(customerSeed)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const visible = useMemo(() => users.filter((user) => `${user.name} ${user.phone} ${user.id}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || user.status === status)), [query, status, users])

  const toggleUser = (id: string) => {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' } : user))
    showToast('Customer access updated')
  }

  return (
    <div className="admin-page"><PageIntro eyebrow="Customer operations" title="Customers" description="Review accounts, order history and trust signals without exposing sensitive payment details." actions={<button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Customer report downloaded')}><PiDownloadSimple /> Export</button>} /><div className="admin-metric-grid admin-metric-grid--compact"><MetricCard label="Total customers" value="84,219" change="+3,142 this month" icon={<PiUsers />} /><MetricCard label="Active this week" value="31,508" change="37.4% engagement" icon={<PiActivity />} /><MetricCard label="New today" value="486" change="+9.8% vs average" icon={<PiUserCircle />} /><MetricCard label="Accounts in review" value="27" change="8 high priority" icon={<PiShieldCheck />} /></div><AdminPanel><AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search name, phone or customer ID" /><FilterSelect label="Filter by customer status" value={status} onChange={setStatus}><option>All statuses</option><option>Active</option><option>Review</option><option>Blocked</option></FilterSelect></AdminToolbar><AdminTable><thead><tr><th>Customer</th><th>Phone</th><th>City</th><th>Orders</th><th>Lifetime spend</th><th>Joined</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.length === 0 && <EmptyRows columns={8} message="No customers match these filters." />}{visible.map((user) => <tr key={user.id}><td><div className="admin-avatar-entity"><span>{user.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{user.name}</strong><small>{user.id}</small></div></div></td><td>{user.phone}</td><td>{user.city}</td><td>{user.orders}</td><td><strong>{user.spend}</strong></td><td>{user.joined}</td><td><StatusBadge tone={toneForStatus(user.status)}>{user.status}</StatusBadge></td><td className="admin-table__actions"><button type="button" onClick={() => showToast(`Opened ${user.id}`)}>View</button><button type="button" onClick={() => toggleUser(user.id)}>{user.status === 'Blocked' ? 'Unblock' : 'Block'}</button></td></tr>)}</tbody></AdminTable></AdminPanel></div>
  )
}

type ServiceAreaRow = { id: string; name: string; city: string; pincode: string; restaurants: number; couriers: number; demand: 'Low' | 'Balanced' | 'High'; active: boolean }
const serviceAreaSeed: ServiceAreaRow[] = cityAreas.map((name, index) => ({ id: `area-${index + 1}`, name, city: 'Bengaluru', pincode: ['560095', '560038', '560102', '560041', '560078', '560066'][index], restaurants: [182, 149, 131, 118, 104, 124][index], couriers: [96, 84, 76, 61, 58, 72][index], demand: (['High', 'Balanced', 'High', 'Low', 'Balanced', 'High'] as const)[index], active: index !== 5 }))

export function AdminServiceAreasPage() {
  const { showToast } = useApp()
  const [areas, setAreas] = useState(serviceAreaSeed)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [pincode, setPincode] = useState('')
  const visible = areas.filter((area) => `${area.name} ${area.pincode}`.toLowerCase().includes(query.toLowerCase()))

  const addArea = (event: FormEvent) => {
    event.preventDefault()
    setAreas((current) => [...current, { id: `area-${Date.now()}`, name, city: 'Bengaluru', pincode, restaurants: 0, couriers: 0, demand: 'Low', active: false }])
    setName(''); setPincode(''); setShowForm(false); showToast('Service area added as inactive')
  }

  return (
    <div className="admin-page"><PageIntro eyebrow="Coverage control" title="Service areas" description="Balance restaurant supply, courier capacity and customer demand by neighbourhood." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => setShowForm((current) => !current)}>{showForm ? <PiX /> : <PiPlus />}{showForm ? 'Close form' : 'Add service area'}</button>} />
      {showForm && <AdminPanel className="admin-inline-form"><PanelHeading title="Add a neighbourhood" description="New areas remain inactive until supply checks pass." /><form onSubmit={addArea}><label className="admin-field"><span>Area name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Example: Bellandur" required /></label><label className="admin-field"><span>Primary pincode</span><input value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" minLength={6} maxLength={6} required /></label><label className="admin-field"><span>City</span><select defaultValue="Bengaluru"><option>Bengaluru</option></select></label><button className="admin-button admin-button--primary" type="submit">Add area</button></form></AdminPanel>}
      <div className="admin-metric-grid admin-metric-grid--compact"><MetricCard label="Active areas" value="42" change="6 shown in Bengaluru" icon={<PiMapPin />} /><MetricCard label="Serviceable customers" value="76.4K" change="91% city coverage" icon={<PiUsers />} /><MetricCard label="Available couriers" value="447" change="82% utilisation" icon={<PiPackage />} /><MetricCard label="High-demand areas" value="9" change="3 need more supply" icon={<PiChartLineUp />} /></div>
      <AdminPanel><AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search area or pincode" /></AdminToolbar><AdminTable><thead><tr><th>Area</th><th>Coverage</th><th>Restaurants</th><th>Couriers online</th><th>Demand</th><th>Status</th></tr></thead><tbody>{visible.map((area) => <tr key={area.id}><td><strong>{area.name}</strong><small>{area.city} · {area.pincode}</small></td><td><div className="admin-coverage"><div className="admin-progress"><i style={{ width: `${Math.min(96, 52 + area.restaurants / 3)}%` }} /></div><small>{Math.min(96, Math.round(52 + area.restaurants / 3))}%</small></div></td><td>{area.restaurants}</td><td>{area.couriers}</td><td><StatusBadge tone={area.demand === 'High' ? 'warning' : area.demand === 'Low' ? 'neutral' : 'success'}>{area.demand}</StatusBadge></td><td><AdminToggle checked={area.active} label={area.active ? 'Active' : 'Inactive'} onChange={(active) => { setAreas((current) => current.map((entry) => entry.id === area.id ? { ...entry, active } : entry)); showToast(`${area.name} ${active ? 'activated' : 'paused'}`) }} /></td></tr>)}</tbody></AdminTable></AdminPanel>
    </div>
  )
}

type RefundStatus = 'Pending review' | 'Approved' | 'Rejected' | 'Processing' | 'Paid'
type RefundRow = { id: string; orderId: string; customer: string; restaurant: string; reason: string; requested: string; amount: number; risk: 'Low' | 'Medium' | 'High'; status: RefundStatus }
const refundSeed: RefundRow[] = [
  { id: 'RF-22018', orderId: 'QB-78483', customer: 'Aditi Rao', restaurant: 'Green Theory', reason: 'Missing item', requested: '29 Aug, 12:44 PM', amount: 249, risk: 'Low', status: 'Pending review' },
  { id: 'RF-22017', orderId: 'QB-78472', customer: 'Divya Rao', restaurant: 'Burger Yard', reason: 'Order cancelled after payment', requested: '29 Aug, 12:34 PM', amount: 519, risk: 'Low', status: 'Processing' },
  { id: 'RF-22014', orderId: 'QB-78416', customer: 'Rahul Nair', restaurant: 'Pasta Street', reason: 'Quality complaint', requested: '29 Aug, 11:02 AM', amount: 699, risk: 'High', status: 'Pending review' },
  { id: 'RF-22011', orderId: 'QB-78392', customer: 'Meera Joseph', restaurant: 'Wok This Way', reason: 'Incorrect item', requested: '29 Aug, 9:38 AM', amount: 279, risk: 'Medium', status: 'Approved' },
  { id: 'RF-21998', orderId: 'QB-78288', customer: 'Kunal Shah', restaurant: 'Corner House', reason: 'Late delivery', requested: '28 Aug, 8:14 PM', amount: 120, risk: 'Low', status: 'Paid' },
]

export function AdminRefundsPage() {
  const { showToast } = useApp()
  const [refunds, setRefunds] = useState(refundSeed)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const visible = refunds.filter((refund) => `${refund.id} ${refund.orderId} ${refund.customer} ${refund.restaurant}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || refund.status === status))
  const decide = (id: string, next: RefundStatus) => { setRefunds((current) => current.map((refund) => refund.id === id ? { ...refund, status: next } : refund)); showToast(`Refund ${next.toLowerCase()}`) }
  return <div className="admin-page"><PageIntro eyebrow="Payments" title="Refunds" description="Review refund eligibility, fraud signals and settlement progress." actions={<button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Refund ledger downloaded')}><PiDownloadSimple /> Download ledger</button>} /><div className="admin-metric-grid admin-metric-grid--compact"><MetricCard label="Pending review" value="18" change="₹12,840 requested" icon={<PiClock />} /><MetricCard label="Approved today" value="42" change="₹28,412 total" icon={<PiCheckCircle />} /><MetricCard label="Processing" value="11" change="Within 3–5 days" icon={<PiActivity />} /><MetricCard label="Refund rate" value="1.7%" change="0.2% below target" icon={<PiMoney />} /></div><AdminPanel><AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search refund, order or customer" /><FilterSelect label="Filter refund status" value={status} onChange={setStatus}><option>All statuses</option><option>Pending review</option><option>Approved</option><option>Rejected</option><option>Processing</option><option>Paid</option></FilterSelect></AdminToolbar><AdminTable><thead><tr><th>Refund</th><th>Customer & order</th><th>Restaurant</th><th>Reason</th><th>Amount</th><th>Risk</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.length === 0 && <EmptyRows columns={8} message="No refunds match these filters." />}{visible.map((refund) => <tr key={refund.id}><td><strong>{refund.id}</strong><small>{refund.requested}</small></td><td><strong>{refund.customer}</strong><small>{refund.orderId}</small></td><td>{refund.restaurant}</td><td>{refund.reason}</td><td><strong>₹{refund.amount}</strong></td><td><StatusBadge tone={toneForStatus(refund.risk)}>{refund.risk}</StatusBadge></td><td><StatusBadge tone={toneForStatus(refund.status)}>{refund.status}</StatusBadge></td><td className="admin-table__actions"><button type="button" onClick={() => showToast(`Opened ${refund.id}`)}>Review</button>{refund.status === 'Pending review' && <><button type="button" onClick={() => decide(refund.id, 'Approved')}>Approve</button><button type="button" onClick={() => decide(refund.id, 'Rejected')}>Reject</button></>}</td></tr>)}</tbody></AdminTable></AdminPanel></div>
}

type PromotionStatus = 'Active' | 'Scheduled' | 'Paused'
type PromotionRow = Offer & { status: PromotionStatus; redemptions: number; spend: string; period: string }
const promotionSeed: PromotionRow[] = offers.map((offer, index) => ({ ...offer, status: (['Active', 'Active', 'Scheduled', 'Paused'] as const)[index], redemptions: [1842, 2264, 0, 618][index], spend: ['₹1.84L', '₹82,410', '₹0', '₹64,880'][index], period: ['20 Aug–8 Sep', '24 Aug–31 Aug', '1 Sep–15 Sep', '1 Aug–28 Aug'][index] }))

export function AdminPromotionsPage() {
  const { showToast } = useApp()
  const [promotions, setPromotions] = useState(promotionSeed)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const visible = promotions.filter((promotion) => `${promotion.title} ${promotion.code}`.toLowerCase().includes(query.toLowerCase()))
  const submit = (event: FormEvent) => { event.preventDefault(); setPromotions((current) => [{ id: `offer-${Date.now()}`, title, code: code.toUpperCase(), description: 'Admin-created campaign', discount: 100, minimum: 299, type: 'restaurant', status: 'Scheduled', redemptions: 0, spend: '₹0', period: '1 Sep–15 Sep' }, ...current]); setTitle(''); setCode(''); setShowForm(false); showToast('Promotion scheduled') }
  const toggle = (id: string) => { setPromotions((current) => current.map((promotion) => promotion.id === id ? { ...promotion, status: promotion.status === 'Active' ? 'Paused' : 'Active' } : promotion)); showToast('Promotion status updated') }
  return <div className="admin-page"><PageIntro eyebrow="Growth controls" title="Promotions" description="Create platform offers, control budgets and monitor redemptions." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => setShowForm((current) => !current)}>{showForm ? <PiX /> : <PiPlus />}{showForm ? 'Close form' : 'Create promotion'}</button>} />{showForm && <AdminPanel className="admin-inline-form"><PanelHeading title="Schedule a promotion" description="Campaigns start in scheduled state for final review." /><form onSubmit={submit}><label className="admin-field"><span>Campaign name</span><input value={title} onChange={(event) => setTitle(event.target.value)} required /></label><label className="admin-field"><span>Coupon code</span><input value={code} onChange={(event) => setCode(event.target.value.replace(/\s/g, '').slice(0, 14))} required /></label><label className="admin-field"><span>Campaign type</span><select defaultValue="Restaurant discount"><option>Restaurant discount</option><option>Free delivery</option><option>Payment offer</option></select></label><button className="admin-button admin-button--primary" type="submit">Schedule campaign</button></form></AdminPanel>}<div className="admin-metric-grid admin-metric-grid--compact"><MetricCard label="Active campaigns" value="12" change="4 platform-wide" icon={<PiMegaphone />} /><MetricCard label="Redemptions today" value="4,724" change="+18.2% vs Friday" icon={<PiTag />} /><MetricCard label="Discount spend" value="₹4.31L" change="71% of daily cap" icon={<PiCurrencyInr />} /><MetricCard label="Incremental orders" value="1,806" change="38% campaign lift" icon={<PiChartLineUp />} /></div><AdminPanel><AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search campaign or coupon code" /></AdminToolbar><AdminTable><thead><tr><th>Campaign</th><th>Benefit</th><th>Period</th><th>Redemptions</th><th>Discount spend</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.map((promotion) => <tr key={promotion.id}><td><strong>{promotion.title}</strong><small>{promotion.code}</small></td><td>{promotion.description}</td><td>{promotion.period}</td><td>{promotion.redemptions.toLocaleString('en-IN')}</td><td><strong>{promotion.spend}</strong></td><td><StatusBadge tone={toneForStatus(promotion.status)}>{promotion.status}</StatusBadge></td><td className="admin-table__actions"><button type="button" onClick={() => showToast(`Editing ${promotion.title}`)}>Edit</button><button type="button" onClick={() => toggle(promotion.id)}>{promotion.status === 'Active' ? 'Pause' : 'Activate'}</button></td></tr>)}</tbody></AdminTable></AdminPanel></div>
}

type ContentStatus = 'Published' | 'Draft' | 'Scheduled' | 'Archived'
type ContentRow = { id: string; title: string; placement: string; audience: string; owner: string; updated: string; status: ContentStatus; visible: boolean }
const contentSeed: ContentRow[] = [
  { id: 'CNT-401', title: 'Weekend favourites near you', placement: 'Customer home · Hero', audience: 'Bengaluru', owner: 'Riya Kapoor', updated: 'Today, 11:28 AM', status: 'Published', visible: true },
  { id: 'CNT-398', title: 'Late-night delivery collection', placement: 'Customer home · Collection', audience: 'Selected areas', owner: 'Mihir Das', updated: 'Today, 9:14 AM', status: 'Scheduled', visible: true },
  { id: 'CNT-394', title: 'Restaurant partner growth story', placement: 'Partner landing', audience: 'All visitors', owner: 'Riya Kapoor', updated: 'Yesterday, 5:42 PM', status: 'Draft', visible: false },
  { id: 'CNT-389', title: 'Monsoon safety notice', placement: 'Checkout · Notice', audience: 'Whitefield', owner: 'Operations', updated: '28 Aug, 2:10 PM', status: 'Published', visible: true },
  { id: 'CNT-376', title: 'Independence week offers', placement: 'Customer home · Hero', audience: 'All customers', owner: 'Mihir Das', updated: '18 Aug, 10:45 AM', status: 'Archived', visible: false },
]

export function AdminContentPage() {
  const { showToast } = useApp()
  const [rows, setRows] = useState(contentSeed)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const visible = rows.filter((row) => `${row.title} ${row.placement} ${row.owner}`.toLowerCase().includes(query.toLowerCase()) && (status === 'All statuses' || row.status === status))
  const toggle = (id: string, checked: boolean) => { setRows((current) => current.map((row) => row.id === id ? { ...row, visible: checked, status: checked ? 'Published' : 'Draft' } : row)); showToast(checked ? 'Content published' : 'Content moved to draft') }
  return <div className="admin-page"><PageIntro eyebrow="Experience management" title="Content" description="Control customer-facing banners, collections and operational notices." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => showToast('New content draft created')}><PiPlus /> Create content</button>} /><div className="admin-content-cards"><article><span><PiGlobe /></span><div><strong>Customer home</strong><small>6 live placements</small></div><button type="button" onClick={() => showToast('Customer home preview opened')}>Preview</button></article><article><span><PiStorefront /></span><div><strong>Partner pages</strong><small>3 live placements</small></div><button type="button" onClick={() => showToast('Partner pages preview opened')}>Preview</button></article><article><span><PiBell /></span><div><strong>Operational notices</strong><small>2 active notices</small></div><button type="button" onClick={() => showToast('Notice manager opened')}>Manage</button></article></div><AdminPanel><AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search title, placement or owner" /><FilterSelect label="Filter by content status" value={status} onChange={setStatus}><option>All statuses</option><option>Published</option><option>Draft</option><option>Scheduled</option><option>Archived</option></FilterSelect></AdminToolbar><AdminTable><thead><tr><th>Content</th><th>Placement</th><th>Audience</th><th>Owner</th><th>Updated</th><th>Status</th><th>Visibility</th></tr></thead><tbody>{visible.length === 0 && <EmptyRows columns={7} message="No content matches these filters." />}{visible.map((row) => <tr key={row.id}><td><strong>{row.title}</strong><small>{row.id}</small></td><td>{row.placement}</td><td>{row.audience}</td><td>{row.owner}</td><td>{row.updated}</td><td><StatusBadge tone={toneForStatus(row.status)}>{row.status}</StatusBadge></td><td><AdminToggle checked={row.visible} onChange={(checked) => toggle(row.id, checked)} label={row.visible ? 'Visible' : 'Hidden'} /></td></tr>)}</tbody></AdminTable></AdminPanel></div>
}

type SupportPriority = 'Low' | 'Medium' | 'High' | 'Critical'
type SupportStatus = AdminIssue['status'] | 'Assigned' | 'Resolved'
type SupportRow = AdminIssue & { customer: string; channel: 'Chat' | 'Phone' | 'Email'; priority: SupportPriority; supportStatus: SupportStatus }
const supportSeed: SupportRow[] = adminIssues.map((issue, index) => ({ ...issue, customer: ['Gourab Pal', 'Aditi Rao', 'Rahul Nair', 'Sara Thomas'][index], channel: (['Chat', 'Phone', 'Email', 'Chat'] as const)[index], priority: (['Medium', 'Critical', 'High', 'High'] as const)[index], supportStatus: issue.status }))

export function AdminSupportPage() {
  const { showToast } = useApp()
  const [tickets, setTickets] = useState(supportSeed)
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('All priorities')
  const visible = tickets.filter((ticket) => `${ticket.type} ${ticket.details} ${ticket.customer}`.toLowerCase().includes(query.toLowerCase()) && (priority === 'All priorities' || ticket.priority === priority))
  const update = (id: string, status: SupportStatus) => { setTickets((current) => current.map((ticket) => ticket.id === id ? { ...ticket, supportStatus: status, owner: status === 'Assigned' ? 'Aarav Mehta' : ticket.owner } : ticket)); showToast(`Ticket ${status.toLowerCase()}`) }
  return <div className="admin-page"><PageIntro eyebrow="Customer care" title="Support queue" description="Prioritise customer-impacting issues and keep ownership clear." actions={<button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Support summary downloaded')}><PiDownloadSimple /> Export summary</button>} /><div className="admin-metric-grid admin-metric-grid--compact"><MetricCard label="Open cases" value="38" change="11 high priority" icon={<PiHeadset />} /><MetricCard label="First response" value="3m 42s" change="Within 5 min target" icon={<PiClock />} /><MetricCard label="Resolved today" value="184" change="92% same-day" icon={<PiCheckCircle />} /><MetricCard label="CSAT" value="4.71" change="+0.08 this week" icon={<PiChartLineUp />} /></div><AdminPanel><AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search issue, customer or order" /><FilterSelect label="Filter by support priority" value={priority} onChange={setPriority}><option>All priorities</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></FilterSelect></AdminToolbar><AdminTable><thead><tr><th>Issue</th><th>Customer</th><th>Channel</th><th>Priority</th><th>Status</th><th>Owner</th><th>Age</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visible.length === 0 && <EmptyRows columns={8} message="No support cases match these filters." />}{visible.map((ticket) => <tr key={ticket.id}><td><strong>{ticket.type}</strong><small>{ticket.details}</small></td><td>{ticket.customer}</td><td><span className="admin-channel">{ticket.channel === 'Phone' ? <PiPhone /> : ticket.channel === 'Email' ? <PiEnvelopeSimple /> : <PiHeadset />}{ticket.channel}</span></td><td><StatusBadge tone={toneForStatus(ticket.priority)}>{ticket.priority}</StatusBadge></td><td><StatusBadge tone={toneForStatus(ticket.supportStatus)}>{ticket.supportStatus}</StatusBadge></td><td>{ticket.owner}</td><td>{ticket.age}</td><td className="admin-table__actions"><button type="button" onClick={() => update(ticket.id, 'Assigned')}>Assign</button><button type="button" onClick={() => update(ticket.id, 'Resolved')}>Resolve</button></td></tr>)}</tbody></AdminTable></AdminPanel></div>
}

type RoleRow = { id: string; name: string; description: string; members: number; scope: string; system: boolean }
const roleSeed: RoleRow[] = [
  { id: 'role-super', name: 'Super admin', description: 'Full platform access and security administration.', members: 3, scope: 'All capabilities', system: true },
  { id: 'role-ops', name: 'Operations admin', description: 'Orders, restaurants, service areas and support.', members: 18, scope: 'Operations', system: true },
  { id: 'role-support', name: 'Support lead', description: 'Customer cases, refunds and order investigation.', members: 24, scope: 'Support & refunds', system: true },
  { id: 'role-finance', name: 'Finance reviewer', description: 'Refund approvals, promotion spend and reports.', members: 7, scope: 'Finance', system: false },
  { id: 'role-content', name: 'Content manager', description: 'Customer and partner content placements.', members: 5, scope: 'Content', system: false },
]
const permissionLabels = ['View operations', 'Manage restaurants', 'Manage orders', 'Approve refunds', 'Publish content', 'Manage roles', 'Export sensitive reports']

export function AdminRolesPage() {
  const { showToast } = useApp()
  const [selectedRole, setSelectedRole] = useState(roleSeed[1])
  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => Object.fromEntries(permissionLabels.map((label, index) => [label, index < 4])))
  const togglePermission = (permission: string) => { setPermissions((current) => ({ ...current, [permission]: !current[permission] })); showToast('Permission draft updated') }
  return <div className="admin-page"><PageIntro eyebrow="Security" title="Roles & access" description="Grant the minimum access each operations team needs." actions={<button className="admin-button admin-button--primary" type="button" onClick={() => showToast('New custom role draft created')}><PiPlus /> Create role</button>} /><div className="admin-role-layout"><AdminPanel><PanelHeading title="Roles" description="57 administrators across five roles" /><div className="admin-role-list">{roleSeed.map((role) => <button type="button" className={selectedRole.id === role.id ? 'active' : ''} key={role.id} onClick={() => setSelectedRole(role)}><span className="admin-role-icon"><PiUserGear /></span><span><strong>{role.name}</strong><small>{role.description}</small></span><b>{role.members}</b></button>)}</div></AdminPanel><AdminPanel><PanelHeading title={selectedRole.name} description={`${selectedRole.members} members · ${selectedRole.scope}`} action={<StatusBadge tone={selectedRole.system ? 'info' : 'neutral'}>{selectedRole.system ? 'System role' : 'Custom role'}</StatusBadge>} /><div className="admin-permission-list">{permissionLabels.map((permission) => <div key={permission}><span><strong>{permission}</strong><small>{permission === 'Manage roles' ? 'Create roles and change administrator permissions.' : 'Access this operational capability in the admin console.'}</small></span><AdminToggle checked={permissions[permission]} onChange={() => togglePermission(permission)} label={permissions[permission] ? 'Allowed' : 'Not allowed'} /></div>)}</div><footer className="admin-panel__footer"><button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Administrator picker opened')}><PiUser /> Manage members</button><button className="admin-button admin-button--primary" type="button" onClick={() => showToast('Role permissions saved')}><PiCheck /> Save permissions</button></footer></AdminPanel></div></div>
}

type AuditRow = { id: string; time: string; actor: string; role: string; action: string; target: string; source: string; result: 'Completed' | 'Failed' | 'Blocked' }
const auditSeed: AuditRow[] = [
  { id: 'AUD-98142', time: '29 Aug 2026, 1:31:42 PM', actor: 'Aarav Mehta', role: 'Operations admin', action: 'Restaurant status changed', target: 'Pasta Street · Offline to Live', source: '10.4.28.17', result: 'Completed' },
  { id: 'AUD-98141', time: '29 Aug 2026, 1:27:18 PM', actor: 'Neha Sharma', role: 'Support lead', action: 'Refund approved', target: 'RF-22011 · ₹279', source: '10.4.21.09', result: 'Completed' },
  { id: 'AUD-98137', time: '29 Aug 2026, 1:18:04 PM', actor: 'Mihir Das', role: 'Content manager', action: 'Content published', target: 'CNT-401 · Customer home hero', source: '10.4.18.44', result: 'Completed' },
  { id: 'AUD-98129', time: '29 Aug 2026, 12:54:27 PM', actor: 'Unknown session', role: 'No role', action: 'Admin login attempted', target: 'finance@quickbite.com', source: '117.201.18.04', result: 'Blocked' },
  { id: 'AUD-98118', time: '29 Aug 2026, 12:32:49 PM', actor: 'Riya Kapoor', role: 'Content manager', action: 'Promotion updated', target: 'QUICK40 · daily cap', source: '10.4.16.31', result: 'Completed' },
  { id: 'AUD-98094', time: '29 Aug 2026, 11:41:13 AM', actor: 'System scheduler', role: 'Automation', action: 'Payout export generated', target: '28 Aug daily settlement', source: 'Internal job', result: 'Failed' },
]

export function AdminAuditLogsPage() {
  const { showToast } = useApp()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('All results')
  const visible = auditSeed.filter((row) => `${row.actor} ${row.action} ${row.target} ${row.id}`.toLowerCase().includes(query.toLowerCase()) && (result === 'All results' || row.result === result))
  return <div className="admin-page"><PageIntro eyebrow="Security record" title="Audit logs" description="Trace administrator and automated changes across sensitive workflows." actions={<button className="admin-button admin-button--secondary" type="button" onClick={() => showToast('Audit export prepared')}><PiDownloadSimple /> Export CSV</button>} /><div className="admin-callout"><PiShieldCheck /><div><strong>Immutable activity record</strong><p>Audit entries are retained for 365 days. Exported records include timestamps, actor identity and source details.</p></div></div><AdminPanel><AdminToolbar><SearchField value={query} onChange={setQuery} placeholder="Search actor, action, target or log ID" /><FilterSelect label="Filter audit result" value={result} onChange={setResult}><option>All results</option><option>Completed</option><option>Failed</option><option>Blocked</option></FilterSelect><button className="admin-date-button" type="button"><PiCalendarBlank /> Last 7 days <PiCaretDown /></button></AdminToolbar><AdminTable><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Source</th><th>Result</th></tr></thead><tbody>{visible.length === 0 && <EmptyRows columns={6} message="No audit entries match these filters." />}{visible.map((row) => <tr key={row.id}><td><strong>{row.time}</strong><small>{row.id}</small></td><td><strong>{row.actor}</strong><small>{row.role}</small></td><td>{row.action}</td><td>{row.target}</td><td>{row.source}</td><td><StatusBadge tone={toneForStatus(row.result)}>{row.result}</StatusBadge></td></tr>)}</tbody></AdminTable></AdminPanel></div>
}

export function AdminSettingsPage() {
  const { showToast } = useApp()
  const [tab, setTab] = useState<'General' | 'Ordering' | 'Notifications' | 'Security'>('General')
  const [maintenance, setMaintenance] = useState(false)
  const [autoRefund, setAutoRefund] = useState(true)
  const [newRestaurantReview, setNewRestaurantReview] = useState(true)
  const [incidentAlerts, setIncidentAlerts] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(true)
  const [mfa, setMfa] = useState(true)

  const save = (event: FormEvent) => { event.preventDefault(); showToast(`${tab} settings saved`) }
  return <div className="admin-page"><PageIntro eyebrow="Platform configuration" title="Settings" description="Manage safe defaults for the QuickBite operations workspace." /><div className="admin-settings-layout"><AdminPanel className="admin-settings-nav"><nav aria-label="Settings sections">{(['General', 'Ordering', 'Notifications', 'Security'] as const).map((label) => <button type="button" className={tab === label ? 'active' : ''} key={label} onClick={() => setTab(label)}>{label === 'General' ? <PiGear /> : label === 'Ordering' ? <PiShoppingBag /> : label === 'Notifications' ? <PiBell /> : <PiShieldCheck />}<span>{label}</span><PiArrowRight /></button>)}</nav></AdminPanel><AdminPanel className="admin-settings-form"><PanelHeading title={`${tab} settings`} description="Changes apply to all authorised operations users." /><form onSubmit={save}>
        {tab === 'General' && <><div className="admin-form-grid"><label className="admin-field"><span>Platform name</span><input defaultValue="QuickBite" /></label><label className="admin-field"><span>Operations timezone</span><select defaultValue="Asia/Kolkata"><option>Asia/Kolkata</option><option>UTC</option></select></label><label className="admin-field"><span>Support email</span><input type="email" defaultValue="support@quickbite.com" /></label><label className="admin-field"><span>Support phone</span><input defaultValue="1800-123-4567" /></label></div><div className="admin-setting-row"><span><strong>Maintenance mode</strong><small>Stop new customer orders while keeping active orders visible.</small></span><AdminToggle checked={maintenance} onChange={setMaintenance} label={maintenance ? 'Enabled' : 'Disabled'} /></div></>}
        {tab === 'Ordering' && <><div className="admin-form-grid"><label className="admin-field"><span>Maximum order value</span><input defaultValue="5000" inputMode="numeric" /></label><label className="admin-field"><span>Default delivery radius</span><select defaultValue="7 km"><option>5 km</option><option>7 km</option><option>10 km</option></select></label><label className="admin-field"><span>Cancellation window</span><select defaultValue="2 minutes"><option>1 minute</option><option>2 minutes</option><option>5 minutes</option></select></label><label className="admin-field"><span>Default preparation buffer</span><select defaultValue="5 minutes"><option>3 minutes</option><option>5 minutes</option><option>8 minutes</option></select></label></div><div className="admin-setting-row"><span><strong>Automatic small refunds</strong><small>Allow verified refunds up to ₹150 without manual review.</small></span><AdminToggle checked={autoRefund} onChange={setAutoRefund} label={autoRefund ? 'Enabled' : 'Disabled'} /></div><div className="admin-setting-row"><span><strong>Review new restaurants</strong><small>Require operations approval before the first customer order.</small></span><AdminToggle checked={newRestaurantReview} onChange={setNewRestaurantReview} label={newRestaurantReview ? 'Required' : 'Not required'} /></div></>}
        {tab === 'Notifications' && <><div className="admin-setting-row"><span><strong>Critical incident alerts</strong><small>Send immediate email and SMS alerts to on-call administrators.</small></span><AdminToggle checked={incidentAlerts} onChange={setIncidentAlerts} label={incidentAlerts ? 'Enabled' : 'Disabled'} /></div><div className="admin-setting-row"><span><strong>Daily operations digest</strong><small>Send an 8 AM summary of orders, refunds and service health.</small></span><AdminToggle checked={dailyDigest} onChange={setDailyDigest} label={dailyDigest ? 'Enabled' : 'Disabled'} /></div><label className="admin-field"><span>Alert recipients</span><textarea defaultValue={'ops-oncall@quickbite.com\nsupport-leads@quickbite.com'} /></label></>}
        {tab === 'Security' && <><div className="admin-setting-row"><span><strong>Require multi-factor authentication</strong><small>All administrators must verify new browsers.</small></span><AdminToggle checked={mfa} onChange={setMfa} label={mfa ? 'Required' : 'Optional'} /></div><div className="admin-form-grid"><label className="admin-field"><span>Session timeout</span><select defaultValue="30 minutes"><option>15 minutes</option><option>30 minutes</option><option>60 minutes</option></select></label><label className="admin-field"><span>Audit retention</span><select defaultValue="365 days"><option>180 days</option><option>365 days</option><option>730 days</option></select></label></div><div className="admin-callout admin-callout--warning"><PiWarning /><div><strong>Security changes are audited</strong><p>Updates to sign-in, session and access policies are written to the immutable audit log.</p></div></div></>}
        <footer className="admin-panel__footer"><button className="admin-button admin-button--secondary" type="reset">Reset</button><button className="admin-button admin-button--primary" type="submit"><PiCheck /> Save changes</button></footer>
      </form></AdminPanel></div></div>
}
