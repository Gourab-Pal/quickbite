import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PiArrowLeft,
  PiArrowRight,
  PiBell,
  PiBriefcase,
  PiCalendar,
  PiCaretDown,
  PiCaretRight,
  PiChartLineUp,
  PiCheck,
  PiCheckCircle,
  PiClock,
  PiCloudArrowUp,
  PiCurrencyInr,
  PiDownloadSimple,
  PiEnvelope,
  PiEye,
  PiForkKnife,
  PiHeadset,
  PiInfo,
  PiLightning,
  PiListBullets,
  PiMapPin,
  PiMegaphone,
  PiMoney,
  PiNotePencil,
  PiPackage,
  PiPhone,
  PiPlus,
  PiReceipt,
  PiSealCheck,
  PiShieldCheck,
  PiShoppingBag,
  PiStar,
  PiStarFill,
  PiStorefront,
  PiTag,
  PiToggleLeft,
  PiToggleRight,
  PiTrendUp,
  PiUploadSimple,
  PiUser,
  PiUsers,
  PiWallet,
  PiWarning,
} from 'react-icons/pi'
import {
  MetricCard,
  PageIntro,
  Rating,
  SearchField,
  StatusBadge,
} from '../../components/Common'
import { useApp } from '../../context/AppContext'
import { menuItems, partnerOrders as initialPartnerOrders } from '../../data'
import { MarketingPage } from '../../layouts'
import type { PartnerOrder } from '../../types'
import './partner.css'

type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type LocalOrderStage = PartnerOrder['stage'] | 'dispatched'
type LocalPartnerOrder = Omit<PartnerOrder, 'stage'> & { stage: LocalOrderStage }

type MenuRow = {
  id: string
  name: string
  category: string
  description: string
  image: string
  price: number
  veg: boolean
  orders: number
  available: boolean
}

type CampaignStatus = 'Active' | 'Scheduled' | 'Paused'
type Campaign = {
  id: string
  name: string
  code: string
  value: string
  minimum: string
  period: string
  redemptions: number
  status: CampaignStatus
}

type DocumentKey = 'fssai' | 'pan' | 'gstin' | 'bank' | 'menu'

const applicationSteps = ['Restaurant details', 'Documents', 'Payout account', 'Review']
const deliveryApplicationSteps = ['Basic details', 'Documents', 'Review']

const partnerMenuSeed: MenuRow[] = menuItems
  .filter((item) => item.restaurantId === 'rest-101')
  .slice(0, 8)
  .map((item, index) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    image: item.image,
    price: item.price,
    veg: item.veg,
    orders: [84, 63, 48, 37, 31, 28, 19, 12][index] ?? 8,
    available: !item.soldOut,
  }))

const initialCampaigns: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Weekend family feast',
    code: 'FAMILY20',
    value: '20% off up to ₹140',
    minimum: '₹499 minimum',
    period: '29 Aug – 6 Sep',
    redemptions: 186,
    status: 'Active',
  },
  {
    id: 'campaign-2',
    name: 'Lunch hour saver',
    code: 'LUNCH75',
    value: 'Flat ₹75 off',
    minimum: '₹299 minimum',
    period: 'Weekdays · 12–3 PM',
    redemptions: 92,
    status: 'Active',
  },
  {
    id: 'campaign-3',
    name: 'September welcome offer',
    code: 'HELLOSEP',
    value: '15% off up to ₹100',
    minimum: '₹349 minimum',
    period: '1 Sep – 15 Sep',
    redemptions: 0,
    status: 'Scheduled',
  },
]

const payoutRows = [
  { id: 'QB-PAY-9082', period: '18–24 Aug 2026', orders: 428, gross: '₹1,84,620', deductions: '₹42,770', net: '₹1,41,850', status: 'Paid' },
  { id: 'QB-PAY-9024', period: '11–17 Aug 2026', orders: 391, gross: '₹1,67,450', deductions: '₹38,530', net: '₹1,28,920', status: 'Paid' },
  { id: 'QB-PAY-8958', period: '4–10 Aug 2026', orders: 376, gross: '₹1,59,780', deductions: '₹36,890', net: '₹1,22,890', status: 'Paid' },
  { id: 'QB-PAY-8891', period: '28 Jul–3 Aug 2026', orders: 344, gross: '₹1,46,210', deductions: '₹34,090', net: '₹1,12,120', status: 'Paid' },
]

const reviewRows = [
  { id: 'review-1', customer: 'Aditi Rao', rating: 5, date: 'Today, 12:42 PM', order: 'QB-2240', text: 'The biryani was packed well, arrived hot and tasted wonderful. The portion was generous too.', tags: ['Great taste', 'Good packaging'] },
  { id: 'review-2', customer: 'Nikhil Sharma', rating: 4, date: 'Yesterday, 8:18 PM', order: 'QB-2219', text: 'Loved the paneer tikka. The mint dip could have been a little more generous.', tags: ['Fresh food'] },
  { id: 'review-3', customer: 'Meera Joseph', rating: 3, date: '27 Aug, 2:11 PM', order: 'QB-2168', text: 'Food was good, but one beverage was missing from the sealed bag.', tags: ['Missing item'] },
]

const supportFaqs = [
  ['How do I pause new orders?', 'Open Availability and switch the outlet offline. You can choose a reason and expected reopening time before confirming.'],
  ['Where can I download payout reports?', 'Payouts contains weekly summaries, order-level annexures and downloadable tax statements.'],
  ['How do I update my FSSAI licence?', 'Open Outlet profile, replace the compliance document and submit it for verification.'],
  ['Can I change the preparation time?', 'Yes. Update the live preparation estimate in Availability; it applies to incoming orders immediately.'],
]

function PartnerPanel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`partner-panel ${className}`.trim()}>{children}</section>
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
    <header className="partner-panel__heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
  )
}

function ToggleControl({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="partner-toggle-row">
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <button
        type="button"
        className={`partner-switch ${checked ? 'partner-switch--on' : ''}`}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      >
        {checked ? <PiToggleRight /> : <PiToggleLeft />}
        <span>{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  )
}

function StepRail({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="partner-step-rail" aria-label="Application progress">
      {steps.map((step, index) => (
        <li key={step} className={index + 1 <= current ? 'is-complete' : ''} aria-current={index + 1 === current ? 'step' : undefined}>
          <span>{index + 1 < current ? <PiCheck /> : index + 1}</span>
          <small>{step}</small>
        </li>
      ))}
    </ol>
  )
}

function orderTone(stage: LocalOrderStage): BadgeTone {
  if (stage === 'ready') return 'success'
  if (stage === 'preparing') return 'warning'
  if (stage === 'dispatched') return 'info'
  return 'neutral'
}

function orderLabel(stage: LocalOrderStage) {
  return stage === 'new'
    ? 'New order'
    : stage === 'preparing'
      ? 'Preparing'
      : stage === 'ready'
        ? 'Ready for pickup'
        : 'Handed over'
}

function nextOrderAction(stage: LocalOrderStage) {
  return stage === 'new'
    ? 'Accept order'
    : stage === 'preparing'
      ? 'Mark ready'
      : stage === 'ready'
        ? 'Hand over'
        : 'Completed'
}

function documentInput(
  label: string,
  key: DocumentKey,
  files: Record<DocumentKey, string>,
  onChange: (key: DocumentKey, event: ChangeEvent<HTMLInputElement>) => void,
) {
  return (
    <label className="partner-upload" key={key}>
      <span className="partner-upload__icon"><PiCloudArrowUp /></span>
      <span>
        <strong>{label}</strong>
        <small>{files[key] || 'PDF, JPG or PNG · up to 5 MB'}</small>
      </span>
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => onChange(key, event)} />
      <span className="partner-button partner-button--secondary partner-button--small">Choose file</span>
    </label>
  )
}

export function PartnerLandingPage() {
  return (
    <MarketingPage>
      <main className="partner-marketing">
      <section className="partner-marketing__hero">
        <div className="partner-marketing__copy">
          <span className="partner-kicker">Restaurant partners</span>
          <h1>Bring your restaurant to more hungry customers.</h1>
          <p>Manage orders, menus, promotions and payouts from one calm workspace built for busy teams.</p>
          <div className="partner-marketing__actions">
            <Link className="partner-button partner-button--primary" to="/partner/apply">Start your application <PiArrowRight /></Link>
            <Link className="partner-button partner-button--secondary" to="/partner/login">Partner login</Link>
          </div>
          <div className="partner-marketing__proof">
            <span><strong>15 min</strong><small>guided application</small></span>
            <span><strong>7 days</strong><small>typical verification</small></span>
            <span><strong>Daily</strong><small>operations support</small></span>
          </div>
        </div>
        <div className="partner-marketing__visual">
          <img src="/assets/people/restaurant-partner.jpg" alt="Restaurant owner standing inside a professional kitchen" />
          <article>
            <span><PiTrendUp /></span>
            <div><strong>+24% order growth</strong><small>Partner performance this month</small></div>
          </article>
        </div>
      </section>

      <section className="partner-marketing__section">
        <header className="partner-marketing__section-heading">
          <span className="partner-kicker">Everything in one place</span>
          <h2>Run smoother service, from prep to payout.</h2>
          <p>Use realistic operating tools now, then connect every surface to your APIs when the backend is ready.</p>
        </header>
        <div className="partner-benefit-grid">
          <article><span><PiShoppingBag /></span><h3>Live order desk</h3><p>Accept incoming orders, update prep status and keep handovers on time.</p></article>
          <article><span><PiForkKnife /></span><h3>Menu control</h3><p>Update prices, descriptions and item availability without slowing the kitchen.</p></article>
          <article><span><PiMegaphone /></span><h3>Growth campaigns</h3><p>Launch offers, track redemptions and see what actually moves demand.</p></article>
          <article><span><PiWallet /></span><h3>Clear payouts</h3><p>Review weekly settlements, deductions and downloadable statements.</p></article>
        </div>
      </section>

      <section className="partner-marketing__section partner-onboarding-summary">
        <div>
          <span className="partner-kicker">Simple onboarding</span>
          <h2>Get ready in four clear steps.</h2>
          <ol>
            <li><span>1</span><div><strong>Tell us about the outlet</strong><small>Restaurant, owner and location details.</small></div></li>
            <li><span>2</span><div><strong>Upload business documents</strong><small>FSSAI, PAN, GSTIN, bank proof and menu.</small></div></li>
            <li><span>3</span><div><strong>Confirm payout details</strong><small>Secure weekly settlement account.</small></div></li>
            <li><span>4</span><div><strong>Review and submit</strong><small>Track every verification update online.</small></div></li>
          </ol>
        </div>
        <PartnerPanel className="partner-document-card">
          <span className="partner-document-card__icon"><PiShieldCheck /></span>
          <h3>Keep these documents ready</h3>
          {['FSSAI licence or acknowledgement', 'PAN card', 'GSTIN certificate', 'Cancelled cheque or bank proof', 'Current restaurant menu'].map((item) => <p key={item}><PiCheckCircle /> {item}</p>)}
          <Link className="partner-button partner-button--mint" to="/partner/apply">Begin application</Link>
        </PartnerPanel>
      </section>
      </main>
    </MarketingPage>
  )
}

export function PartnerLoginPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [step, setStep] = useState<'identity' | 'otp'>('identity')
  const [identifier, setIdentifier] = useState('9876543210')
  const [otp, setOtp] = useState('123456')
  const [showInfo, setShowInfo] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (step === 'identity') {
      setStep('otp')
      showToast('Verification code sent')
      return
    }
    showToast('Welcome back to Spice Story Cafe')
    navigate('/partner/dashboard')
  }

  return (
    <main className="partner-auth-page">
      <Link className="partner-auth-back" to="/partner"><PiArrowLeft /> Back to partner overview</Link>
      <section className="partner-auth-card">
        <div className="partner-auth-card__visual">
          <img src="/assets/food/restaurant.jpg" alt="A welcoming restaurant interior" />
          <div>
            <span className="partner-kicker">QuickBite Partner</span>
            <h1>One workspace for every service.</h1>
            <p>Stay ahead of orders, menu changes and payouts without switching tools.</p>
          </div>
        </div>
        <div className="partner-auth-card__form">
          <span className="partner-auth-icon"><PiStorefront /></span>
          <h2>{step === 'identity' ? 'Partner login' : 'Verify your number'}</h2>
          <p>{step === 'identity' ? 'Enter your registered mobile number or restaurant ID.' : `Use the six-digit code sent for ${identifier}.`}</p>
          <form onSubmit={submit}>
            {step === 'identity' ? (
              <label className="partner-field">
                <span>Mobile number or restaurant ID</span>
                <div className="partner-input-with-action">
                  <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required />
                  <button type="button" aria-label="Why we ask for this" onClick={() => setShowInfo((current) => !current)}><PiInfo /></button>
                </div>
              </label>
            ) : (
              <label className="partner-field">
                <span>One-time password</span>
                <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" minLength={6} maxLength={6} required />
              </label>
            )}
            {showInfo && step === 'identity' && (
              <aside className="partner-info-box">
                <PiInfo />
                <div><strong>Choose the right login</strong><p>Use a registered mobile number to track the business, or a restaurant ID for order-only access.</p></div>
              </aside>
            )}
            <button className="partner-button partner-button--primary partner-button--full" type="submit">
              {step === 'identity' ? 'Continue' : 'Verify and sign in'} <PiArrowRight />
            </button>
          </form>
          {step === 'otp' && <button className="partner-text-button" type="button" onClick={() => setStep('identity')}><PiArrowLeft /> Change login details</button>}
          <p className="partner-auth-card__legal">By logging in, you agree to QuickBite’s <Link to="/terms">partner terms</Link> and <Link to="/privacy">privacy policy</Link>.</p>
          <div className="partner-auth-card__join">New restaurant? <Link to="/partner/apply">Start an application</Link></div>
        </div>
      </section>
    </main>
  )
}

export function PartnerApplicationPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [step, setStep] = useState(1)
  const [details, setDetails] = useState({
    restaurantName: 'Spice Story Cafe',
    ownerName: 'Arjun Rao',
    phone: '9876543210',
    email: 'arjun@spicestory.example',
    city: 'Bengaluru',
    address: '80 Feet Road, Koramangala 4th Block',
    cuisine: 'North Indian, Biryani, Cafe',
  })
  const [documents, setDocuments] = useState<Record<DocumentKey, string>>({
    fssai: 'spice-story-fssai.pdf',
    pan: 'arjun-rao-pan.pdf',
    gstin: 'spice-story-gstin.pdf',
    bank: 'cancelled-cheque.pdf',
    menu: 'spice-story-menu.pdf',
  })
  const [bank, setBank] = useState({ accountName: 'Spice Story Hospitality', accountNumber: '0284010007842', ifsc: 'HDFC0000284' })

  const updateDocument = (key: DocumentKey, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setDocuments((current) => ({ ...current, [key]: file.name }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (step < applicationSteps.length) {
      setStep((current) => current + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    showToast('Application submitted successfully')
    navigate('/partner/application-status')
  }

  return (
    <main className="partner-application-page">
      <header className="partner-application-header">
        <Link to="/partner"><PiArrowLeft /> Back to partner overview</Link>
        <span>Application QB-PA-24081</span>
      </header>
      <section className="partner-application-shell">
        <div className="partner-application-title">
          <span className="partner-kicker">Restaurant onboarding</span>
          <h1>List your restaurant on QuickBite.</h1>
          <p>Your progress is saved locally as you move through the application.</p>
        </div>
        <StepRail steps={applicationSteps} current={step} />
        <form className="partner-application-form" onSubmit={submit}>
          {step === 1 && (
            <PartnerPanel>
              <PanelHeading title="Tell us about your restaurant" description="Use the business details shown on your licences and storefront." />
              <div className="partner-form-grid">
                <label className="partner-field"><span>Restaurant name</span><input value={details.restaurantName} onChange={(event) => setDetails({ ...details, restaurantName: event.target.value })} required /></label>
                <label className="partner-field"><span>Owner or authorised contact</span><input value={details.ownerName} onChange={(event) => setDetails({ ...details, ownerName: event.target.value })} required /></label>
                <label className="partner-field"><span>Mobile number</span><input value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} required /></label>
                <label className="partner-field"><span>Work email</span><input type="email" value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} required /></label>
                <label className="partner-field"><span>City</span><select value={details.city} onChange={(event) => setDetails({ ...details, city: event.target.value })}><option>Bengaluru</option><option>Hyderabad</option><option>Chennai</option><option>Mumbai</option></select></label>
                <label className="partner-field"><span>Primary cuisines</span><input value={details.cuisine} onChange={(event) => setDetails({ ...details, cuisine: event.target.value })} required /></label>
                <label className="partner-field partner-field--wide"><span>Outlet address</span><textarea value={details.address} onChange={(event) => setDetails({ ...details, address: event.target.value })} required /></label>
              </div>
            </PartnerPanel>
          )}

          {step === 2 && (
            <PartnerPanel>
              <PanelHeading title="Upload restaurant documents" description="Clear, current documents help our team verify the outlet faster." />
              <div className="partner-upload-grid">
                {documentInput('FSSAI licence', 'fssai', documents, updateDocument)}
                {documentInput('PAN card', 'pan', documents, updateDocument)}
                {documentInput('GSTIN certificate', 'gstin', documents, updateDocument)}
                {documentInput('Cancelled cheque or bank proof', 'bank', documents, updateDocument)}
                {documentInput('Current restaurant menu', 'menu', documents, updateDocument)}
              </div>
              <aside className="partner-info-box"><PiShieldCheck /><div><strong>Your files stay private</strong><p>Documents are used only for business verification and payout setup.</p></div></aside>
            </PartnerPanel>
          )}

          {step === 3 && (
            <PartnerPanel>
              <PanelHeading title="Choose your payout account" description="Weekly settlements will be transferred to this verified account." />
              <div className="partner-form-grid">
                <label className="partner-field partner-field--wide"><span>Account holder or business name</span><input value={bank.accountName} onChange={(event) => setBank({ ...bank, accountName: event.target.value })} required /></label>
                <label className="partner-field"><span>Account number</span><input value={bank.accountNumber} onChange={(event) => setBank({ ...bank, accountNumber: event.target.value })} required /></label>
                <label className="partner-field"><span>IFSC code</span><input value={bank.ifsc} onChange={(event) => setBank({ ...bank, ifsc: event.target.value.toUpperCase() })} required /></label>
              </div>
              <div className="partner-bank-preview"><span><PiWallet /></span><div><small>Settlement account</small><strong>{bank.accountName}</strong><p>•••• {bank.accountNumber.slice(-4)} · {bank.ifsc}</p></div><StatusBadge tone="success">Ready to verify</StatusBadge></div>
            </PartnerPanel>
          )}

          {step === 4 && (
            <PartnerPanel>
              <PanelHeading title="Review your application" description="Confirm the information below before sending it for verification." />
              <div className="partner-review-summary">
                <article><span><PiStorefront /></span><div><small>Restaurant</small><strong>{details.restaurantName}</strong><p>{details.address}, {details.city}</p></div><button type="button" onClick={() => setStep(1)}>Edit</button></article>
                <article><span><PiUser /></span><div><small>Primary contact</small><strong>{details.ownerName}</strong><p>{details.phone} · {details.email}</p></div><button type="button" onClick={() => setStep(1)}>Edit</button></article>
                <article><span><PiReceipt /></span><div><small>Documents</small><strong>5 documents attached</strong><p>FSSAI, PAN, GSTIN, bank proof and menu</p></div><button type="button" onClick={() => setStep(2)}>Edit</button></article>
                <article><span><PiWallet /></span><div><small>Payout account</small><strong>{bank.accountName}</strong><p>•••• {bank.accountNumber.slice(-4)} · {bank.ifsc}</p></div><button type="button" onClick={() => setStep(3)}>Edit</button></article>
              </div>
              <label className="partner-check-row"><input type="checkbox" defaultChecked required /><span>I confirm these details are accurate and I am authorised to submit this restaurant application.</span></label>
            </PartnerPanel>
          )}

          <footer className="partner-form-actions">
            <button className="partner-button partner-button--secondary" type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}><PiArrowLeft /> Back</button>
            <button className="partner-button partner-button--primary" type="submit">{step === applicationSteps.length ? 'Submit application' : 'Save and continue'} <PiArrowRight /></button>
          </footer>
        </form>
      </section>
    </main>
  )
}

export function PartnerApplicationStatusPage() {
  const { showToast } = useApp()
  return (
    <main className="partner-status-page">
      <header className="partner-application-header">
        <Link to="/partner"><PiArrowLeft /> Back to partner overview</Link>
        <span>Application QB-PA-24081</span>
      </header>
      <div className="partner-status-content">
        <section className="partner-status-hero">
          <span><PiClock /></span>
          <div>
            <span className="partner-kicker">Application QB-PA-24081</span>
            <h1>Your documents are being verified.</h1>
            <p>Submitted on 29 August 2026 · We expect the next update within two business days.</p>
          </div>
          <StatusBadge tone="warning">In review</StatusBadge>
        </section>
        <div className="partner-status-grid">
          <PartnerPanel>
            <PanelHeading title="Application progress" description="We will notify you whenever a stage changes." />
            <ol className="partner-status-timeline">
              <li className="is-complete"><span><PiCheck /></span><div><strong>Application submitted</strong><small>29 Aug, 11:24 AM</small></div></li>
              <li className="is-current"><span><PiEye /></span><div><strong>Document verification</strong><small>Our onboarding team is reviewing five documents.</small></div></li>
              <li><span>3</span><div><strong>Outlet verification</strong><small>Location and menu checks</small></div></li>
              <li><span>4</span><div><strong>Partner agreement</strong><small>Final terms and activation</small></div></li>
            </ol>
          </PartnerPanel>
          <div className="partner-status-side">
            <PartnerPanel>
              <PanelHeading title="Submitted documents" />
              <div className="partner-document-list">
                {['FSSAI licence', 'PAN card', 'GSTIN certificate', 'Bank proof', 'Restaurant menu'].map((document) => <span key={document}><PiCheckCircle /> {document}<small>Received</small></span>)}
              </div>
              <button className="partner-button partner-button--secondary partner-button--full" type="button" onClick={() => showToast('Document update link opened')}>Update documents</button>
            </PartnerPanel>
            <PartnerPanel className="partner-help-card">
              <span><PiHeadset /></span>
              <h3>Need onboarding help?</h3>
              <p>Your partner specialist, Kavya, is available Mon–Sat from 9 AM to 7 PM.</p>
              <button type="button" onClick={() => showToast('Kavya will call you shortly')}><PiPhone /> Request a call</button>
            </PartnerPanel>
          </div>
        </div>
      </div>
    </main>
  )
}

export function PartnerDashboardPage() {
  const { showToast } = useApp()
  const [online, setOnline] = useState(true)

  return (
    <section className="partner-page">
      <PageIntro
        eyebrow="Saturday, 29 August"
        title="Good afternoon, Arjun."
        description="Lunch service is moving smoothly. Three new orders need your attention."
        actions={
          <button
            className={`partner-online-control ${online ? 'is-online' : ''}`}
            type="button"
            role="switch"
            aria-checked={online}
            onClick={() => {
              setOnline((current) => !current)
              showToast(online ? 'Outlet is now offline' : 'Outlet is accepting orders')
            }}
          >
            {online ? <PiToggleRight /> : <PiToggleLeft />}
            <span><strong>{online ? 'Accepting orders' : 'Outlet offline'}</strong><small>{online ? 'Kitchen closes at 11:00 PM' : 'Customers cannot place orders'}</small></span>
          </button>
        }
      />

      {!online && (
        <aside className="partner-alert partner-alert--warning">
          <PiWarning />
          <div><strong>Your outlet is offline.</strong><p>New customers cannot place orders until you resume service.</p></div>
          <button type="button" onClick={() => setOnline(true)}>Go online</button>
        </aside>
      )}

      <div className="partner-metric-grid">
        <MetricCard label="Orders today" value="86" change="+18% vs last Saturday" icon={<PiShoppingBag />} />
        <MetricCard label="Gross sales" value="₹34,820" change="+12.4% week on week" icon={<PiCurrencyInr />} />
        <MetricCard label="Average prep time" value="17 min" change="2 min faster today" icon={<PiClock />} />
        <MetricCard label="Customer rating" value="4.6" change="From 1,284 ratings" icon={<PiStarFill />} />
      </div>

      <div className="partner-dashboard-grid">
        <PartnerPanel className="partner-dashboard-orders">
          <PanelHeading title="Live order desk" description="Incoming orders are sorted by urgency." action={<Link to="/partner/orders">Open all orders <PiArrowRight /></Link>} />
          <div className="partner-compact-order-list">
            {initialPartnerOrders.slice(0, 4).map((order) => (
              <article key={order.id}>
                <span className={`partner-order-dot partner-order-dot--${order.stage}`} />
                <div><strong>{order.id}</strong><p>{order.items}</p></div>
                <span><small>{order.minutes} min ago</small><strong>₹{order.amount}</strong></span>
                <StatusBadge tone={orderTone(order.stage)}>{orderLabel(order.stage)}</StatusBadge>
              </article>
            ))}
          </div>
        </PartnerPanel>

        <PartnerPanel className="partner-service-health">
          <PanelHeading title="Service health" description="Live checks for this outlet." />
          <div className="partner-health-score"><strong>92</strong><span><b>Excellent</b><small>Outlet score</small></span></div>
          <div className="partner-health-list">
            <span><small>Order acceptance</small><strong>98%</strong><progress max="100" value="98" /></span>
            <span><small>Menu availability</small><strong>94%</strong><progress max="100" value="94" /></span>
            <span><small>On-time preparation</small><strong>86%</strong><progress max="100" value="86" /></span>
          </div>
          <Link to="/partner/availability">Review availability <PiCaretRight /></Link>
        </PartnerPanel>

        <PartnerPanel className="partner-revenue-panel">
          <PanelHeading title="Revenue this week" description="Daily gross order value, compared with last week." action={<select aria-label="Revenue range" defaultValue="7"><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select>} />
          <div className="partner-revenue-total"><span><small>Gross sales</small><strong>₹2,18,460</strong></span><StatusBadge tone="success"><PiTrendUp /> 14.2%</StatusBadge></div>
          <div className="partner-revenue-days">
            {[
              ['Sat', '₹34,820', 88], ['Fri', '₹38,140', 96], ['Thu', '₹29,780', 75],
              ['Wed', '₹31,250', 79], ['Tue', '₹26,940', 68], ['Mon', '₹27,410', 69], ['Sun', '₹30,120', 76],
            ].map(([day, value, score]) => <span key={day}><small>{day}</small><meter min="0" max="100" value={Number(score)}>{score}</meter><strong>{value}</strong></span>)}
          </div>
        </PartnerPanel>

        <PartnerPanel className="partner-action-panel">
          <PanelHeading title="Recommended actions" description="Small improvements with the highest impact." />
          <div className="partner-action-list">
            <Link to="/partner/menu"><span><PiForkKnife /></span><div><strong>Bring 3 popular items back online</strong><small>Could recover an estimated ₹2,400 in weekly sales.</small></div><PiCaretRight /></Link>
            <Link to="/partner/offers"><span><PiMegaphone /></span><div><strong>Extend your lunch campaign</strong><small>LUNCH75 is converting 1.8× above your average.</small></div><PiCaretRight /></Link>
            <Link to="/partner/reviews"><span><PiStar /></span><div><strong>Reply to 2 recent reviews</strong><small>Customers value quick, thoughtful responses.</small></div><PiCaretRight /></Link>
          </div>
        </PartnerPanel>
      </div>
    </section>
  )
}

export function PartnerOrdersPage() {
  const { showToast } = useApp()
  const [orders, setOrders] = useState<LocalPartnerOrder[]>(initialPartnerOrders.map((order) => ({ ...order })))
  const [stage, setStage] = useState<'all' | LocalOrderStage>('all')
  const [query, setQuery] = useState('')

  const visibleOrders = useMemo(() => orders.filter((order) => {
    const matchesStage = stage === 'all' || order.stage === stage
    const normalized = query.toLowerCase()
    return matchesStage && (order.id.toLowerCase().includes(normalized) || order.customer.toLowerCase().includes(normalized) || order.items.toLowerCase().includes(normalized))
  }), [orders, query, stage])

  const advance = (id: string) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== id) return order
      const next: LocalOrderStage = order.stage === 'new' ? 'preparing' : order.stage === 'preparing' ? 'ready' : order.stage === 'ready' ? 'dispatched' : 'dispatched'
      showToast(`${id} moved to ${orderLabel(next).toLowerCase()}`)
      return { ...order, stage: next }
    }))
  }

  const decline = (id: string) => {
    setOrders((current) => current.filter((order) => order.id !== id))
    showToast(`${id} declined`)
  }

  const stageCounts = (value: LocalOrderStage) => orders.filter((order) => order.stage === value).length

  return (
    <section className="partner-page">
      <PageIntro eyebrow="Live operations" title="Orders" description="Keep every ticket moving from acceptance to rider handover." actions={<button className="partner-button partner-button--secondary" type="button" onClick={() => showToast('Order desk refreshed')}><PiBell /> Refresh desk</button>} />
      <div className="partner-order-toolbar">
        <div className="partner-tabs" role="tablist" aria-label="Order stages">
          {([
            ['all', 'All', orders.length],
            ['new', 'New', stageCounts('new')],
            ['preparing', 'Preparing', stageCounts('preparing')],
            ['ready', 'Ready', stageCounts('ready')],
            ['dispatched', 'Handed over', stageCounts('dispatched')],
          ] as const).map(([value, label, count]) => <button key={value} type="button" role="tab" aria-selected={stage === value} className={stage === value ? 'is-active' : ''} onClick={() => setStage(value)}>{label} <span>{count}</span></button>)}
        </div>
        <SearchField value={query} onChange={setQuery} placeholder="Search order or customer" />
      </div>

      <div className="partner-order-board">
        {visibleOrders.map((order) => (
          <article key={order.id} className={`partner-order-card partner-order-card--${order.stage}`}>
            <header>
              <div><strong>{order.id}</strong><span><PiClock /> {order.minutes} min ago</span></div>
              <StatusBadge tone={orderTone(order.stage)}>{orderLabel(order.stage)}</StatusBadge>
            </header>
            <div className="partner-order-card__customer"><span><PiUser /></span><div><small>Customer</small><strong>{order.customer}</strong></div><strong>₹{order.amount}</strong></div>
            <div className="partner-order-card__items"><small>Items</small><p>{order.items}</p></div>
            <div className="partner-order-card__meta"><span><PiReceipt /> Paid online</span><span><PiMapPin /> 2.4 km delivery</span></div>
            <footer>
              {order.stage === 'new' && <button className="partner-button partner-button--ghost partner-button--small" type="button" onClick={() => decline(order.id)}>Decline</button>}
              <button className="partner-button partner-button--mint partner-button--small" type="button" disabled={order.stage === 'dispatched'} onClick={() => advance(order.id)}>{nextOrderAction(order.stage)} {order.stage !== 'dispatched' && <PiArrowRight />}</button>
            </footer>
          </article>
        ))}
        {!visibleOrders.length && <div className="partner-empty-inline"><PiShoppingBag /><h2>No orders in this view</h2><p>Try another stage or clear the search.</p></div>}
      </div>
    </section>
  )
}

export function PartnerMenuPage() {
  const { showToast } = useApp()
  const [items, setItems] = useState<MenuRow[]>(partnerMenuSeed)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category)))]
  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    return matchesCategory && item.name.toLowerCase().includes(query.toLowerCase())
  }), [category, items, query])

  const toggleItem = (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, available: !item.available } : item))
    const item = items.find((entry) => entry.id === id)
    showToast(`${item?.name ?? 'Item'} marked ${item?.available ? 'unavailable' : 'available'}`)
  }

  const addItem = () => {
    const id = `partner-item-${Date.now()}`
    setItems((current) => [{
      id,
      name: 'Chef’s seasonal special',
      category: 'Bestsellers',
      description: 'A rotating kitchen special created with fresh seasonal ingredients.',
      image: '/assets/food/indian-thali.jpg',
      price: 329,
      veg: true,
      orders: 0,
      available: true,
    }, ...current])
    showToast('New menu item added')
  }

  return (
    <section className="partner-page">
      <PageIntro eyebrow="Catalogue" title="Menu" description="Keep descriptions, pricing and live availability accurate across service." actions={<button className="partner-button partner-button--primary" type="button" onClick={addItem}><PiPlus /> Add menu item</button>} />
      <div className="partner-menu-summary">
        <span><strong>{items.length}</strong><small>Total items</small></span>
        <span><strong>{items.filter((item) => item.available).length}</strong><small>Available now</small></span>
        <span><strong>{items.filter((item) => !item.available).length}</strong><small>Unavailable</small></span>
        <span><strong>94%</strong><small>Menu availability</small></span>
      </div>
      <PartnerPanel>
        <div className="partner-menu-toolbar">
          <div className="partner-tabs" role="tablist" aria-label="Menu categories">{categories.map((value) => <button key={value} type="button" role="tab" aria-selected={category === value} className={category === value ? 'is-active' : ''} onClick={() => setCategory(value)}>{value}</button>)}</div>
          <SearchField value={query} onChange={setQuery} placeholder="Search menu items" />
        </div>
        <div className="partner-menu-table-wrap">
          <table className="partner-table partner-menu-table">
            <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Orders this week</th><th>Availability</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={item.id}>
                  <td><div className="partner-menu-item"><img src={item.image} alt="" /><span><strong>{item.name}</strong><small>{item.description}</small></span></div></td>
                  <td><span className={item.veg ? 'partner-food-mark partner-food-mark--veg' : 'partner-food-mark partner-food-mark--nonveg'} /> {item.category}</td>
                  <td><strong>₹{item.price}</strong></td>
                  <td>{item.orders}</td>
                  <td><button className={`partner-switch ${item.available ? 'partner-switch--on' : ''}`} type="button" role="switch" aria-checked={item.available} onClick={() => toggleItem(item.id)}>{item.available ? <PiToggleRight /> : <PiToggleLeft />}<span>{item.available ? 'Available' : 'Unavailable'}</span></button></td>
                  <td><button className="partner-icon-button" type="button" aria-label={`Edit ${item.name}`} onClick={() => showToast(`${item.name} editor opened`)}><PiNotePencil /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PartnerPanel>
    </section>
  )
}

export function PartnerAvailabilityPage() {
  const { showToast } = useApp()
  const [online, setOnline] = useState(true)
  const [delivery, setDelivery] = useState(true)
  const [pickup, setPickup] = useState(true)
  const [scheduled, setScheduled] = useState(false)
  const [vacation, setVacation] = useState(false)
  const [prepTime, setPrepTime] = useState('18')

  return (
    <section className="partner-page">
      <PageIntro eyebrow="Live service" title="Availability" description="Control when and how customers can order from this outlet." />
      <div className="partner-availability-grid">
        <PartnerPanel className={`partner-outlet-state ${online ? 'is-online' : ''}`}>
          <span className="partner-outlet-state__icon"><PiStorefront /></span>
          <div><small>Spice Story Cafe</small><h2>{online ? 'Open and accepting orders' : 'Outlet is offline'}</h2><p>{online ? 'All enabled service modes are available to customers.' : 'Customers can still view the restaurant but cannot order.'}</p></div>
          <button type="button" className={`partner-switch partner-switch--large ${online ? 'partner-switch--on' : ''}`} role="switch" aria-checked={online} onClick={() => { setOnline((current) => !current); showToast(online ? 'Outlet paused' : 'Outlet is back online') }}>{online ? <PiToggleRight /> : <PiToggleLeft />}<span>{online ? 'Online' : 'Offline'}</span></button>
        </PartnerPanel>
        <PartnerPanel>
          <PanelHeading title="Live kitchen settings" description="Changes take effect for the next incoming order." />
          <div className="partner-form-grid">
            <label className="partner-field"><span>Preparation time</span><select value={prepTime} onChange={(event) => setPrepTime(event.target.value)}><option value="12">12 minutes</option><option value="18">18 minutes</option><option value="25">25 minutes</option><option value="35">35 minutes</option></select></label>
            <label className="partner-field"><span>Delivery radius</span><select defaultValue="5"><option value="3">3 km</option><option value="5">5 km</option><option value="7">7 km</option></select></label>
          </div>
          <div className="partner-toggle-list">
            <ToggleControl checked={delivery} onChange={setDelivery} label="Delivery orders" description="Prepared here and delivered by QuickBite riders." />
            <ToggleControl checked={pickup} onChange={setPickup} label="Customer pickup" description="Customers collect completed orders at the counter." />
            <ToggleControl checked={scheduled} onChange={setScheduled} label="Scheduled orders" description="Accept orders up to two days in advance." />
          </div>
        </PartnerPanel>
        <PartnerPanel>
          <PanelHeading title="Regular opening hours" description="The outlet closes automatically outside these hours." action={<button className="partner-text-button" type="button" onClick={() => showToast('Opening hours copied to every day')}>Copy to all days</button>} />
          <div className="partner-hours-list">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => <div key={day}><label><input type="checkbox" defaultChecked /><span>{day}</span></label><input type="time" defaultValue="09:00" aria-label={`${day} opening time`} /><span>to</span><input type="time" defaultValue={day === 'Saturday' || day === 'Sunday' ? '23:30' : '23:00'} aria-label={`${day} closing time`} /></div>)}
          </div>
        </PartnerPanel>
        <PartnerPanel>
          <PanelHeading title="Planned closure" description="Pause the outlet for a holiday, maintenance or private event." />
          <ToggleControl checked={vacation} onChange={setVacation} label="Schedule a closure" description="The outlet automatically reopens at the selected time." />
          {vacation && <div className="partner-form-grid partner-planned-closure"><label className="partner-field"><span>Closure starts</span><input type="datetime-local" defaultValue="2026-09-02T09:00" /></label><label className="partner-field"><span>Reopen at</span><input type="datetime-local" defaultValue="2026-09-03T09:00" /></label><label className="partner-field partner-field--wide"><span>Reason</span><select defaultValue="maintenance"><option value="maintenance">Kitchen maintenance</option><option value="holiday">Public holiday</option><option value="event">Private event</option></select></label></div>}
        </PartnerPanel>
      </div>
      <div className="partner-sticky-save"><span><PiInfo /> Unsaved local changes</span><button className="partner-button partner-button--primary" type="button" onClick={() => showToast('Availability settings saved')}>Save availability</button></div>
    </section>
  )
}

export function PartnerOffersPage() {
  const { showToast } = useApp()
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [form, setForm] = useState({ name: '', code: '', value: '20', cap: '120', minimum: '299', start: '2026-08-30', end: '2026-09-06' })

  const createCampaign = (event: FormEvent) => {
    event.preventDefault()
    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: form.name,
      code: form.code.toUpperCase(),
      value: `${form.value}% off up to ₹${form.cap}`,
      minimum: `₹${form.minimum} minimum`,
      period: `${form.start} – ${form.end}`,
      redemptions: 0,
      status: 'Scheduled',
    }
    setCampaigns((current) => [campaign, ...current])
    setForm((current) => ({ ...current, name: '', code: '' }))
    showToast('Offer scheduled successfully')
  }

  const toggleCampaign = (id: string) => {
    setCampaigns((current) => current.map((campaign) => campaign.id === id ? { ...campaign, status: campaign.status === 'Active' ? 'Paused' : 'Active' } : campaign))
    showToast('Campaign status updated')
  }

  return (
    <section className="partner-page">
      <PageIntro eyebrow="Growth" title="Offers and discounts" description="Create value-led campaigns and track how customers respond." />
      <div className="partner-offers-layout">
        <PartnerPanel className="partner-offer-builder">
          <PanelHeading title="Create an offer" description="Configure a restaurant-funded discount for this outlet." />
          <form onSubmit={createCampaign}>
            <div className="partner-form-grid">
              <label className="partner-field partner-field--wide"><span>Campaign name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Dinner delight" required /></label>
              <label className="partner-field"><span>Coupon code</span><input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase().replace(/\s/g, '') })} placeholder="DINNER20" required /></label>
              <label className="partner-field"><span>Discount percentage</span><div className="partner-input-affix"><input type="number" min="1" max="80" value={form.value} onChange={(event) => setForm({ ...form, value: event.target.value })} /><span>%</span></div></label>
              <label className="partner-field"><span>Maximum discount</span><div className="partner-input-affix"><span>₹</span><input type="number" min="1" value={form.cap} onChange={(event) => setForm({ ...form, cap: event.target.value })} /></div></label>
              <label className="partner-field"><span>Minimum order</span><div className="partner-input-affix"><span>₹</span><input type="number" min="1" value={form.minimum} onChange={(event) => setForm({ ...form, minimum: event.target.value })} /></div></label>
              <label className="partner-field"><span>Start date</span><input type="date" value={form.start} onChange={(event) => setForm({ ...form, start: event.target.value })} /></label>
              <label className="partner-field"><span>End date</span><input type="date" value={form.end} onChange={(event) => setForm({ ...form, end: event.target.value })} /></label>
            </div>
            <aside className="partner-offer-preview"><span><PiTag /></span><div><small>Customer sees</small><strong>{form.value}% OFF up to ₹{form.cap}</strong><p>Use {form.code || 'YOURCODE'} on orders above ₹{form.minimum}</p></div></aside>
            <button className="partner-button partner-button--primary partner-button--full" type="submit"><PiMegaphone /> Schedule campaign</button>
          </form>
        </PartnerPanel>
        <div className="partner-campaign-column">
          <div className="partner-metric-grid partner-metric-grid--compact">
            <MetricCard label="Offer orders" value="278" change="This month" icon={<PiReceipt />} />
            <MetricCard label="Campaign sales" value="₹1.18L" change="5.4× return" icon={<PiChartLineUp />} />
          </div>
          <PartnerPanel>
            <PanelHeading title="Campaigns" description="Active and scheduled offers for this outlet." />
            <div className="partner-campaign-list">
              {campaigns.map((campaign) => (
                <article key={campaign.id}>
                  <span className="partner-campaign-list__icon"><PiMegaphone /></span>
                  <div><header><strong>{campaign.name}</strong><StatusBadge tone={campaign.status === 'Active' ? 'success' : campaign.status === 'Scheduled' ? 'info' : 'neutral'}>{campaign.status}</StatusBadge></header><p>{campaign.value} · {campaign.minimum}</p><small>{campaign.period}</small><footer><code>{campaign.code}</code><span>{campaign.redemptions} redemptions</span></footer></div>
                  <button className="partner-icon-button" type="button" aria-label={`${campaign.status === 'Active' ? 'Pause' : 'Activate'} ${campaign.name}`} onClick={() => toggleCampaign(campaign.id)}>{campaign.status === 'Active' ? <PiToggleRight /> : <PiToggleLeft />}</button>
                </article>
              ))}
            </div>
          </PartnerPanel>
        </div>
      </div>
    </section>
  )
}

export function PartnerAnalyticsPage() {
  const [range, setRange] = useState('Last 30 days')
  const topItems = [
    ['Signature Chicken Biryani', '542 orders', '₹1,89,158', 92],
    ['Paneer Tikka Feast', '388 orders', '₹1,23,772', 78],
    ['Classic Margherita Pizza', '314 orders', '₹1,03,306', 67],
    ['Crispy Chilli Chicken', '286 orders', '₹79,794', 61],
  ]

  return (
    <section className="partner-page">
      <PageIntro
        eyebrow="Performance"
        title="Analytics"
        description="Understand sales, operations and customer conversion for Spice Story Cafe."
        actions={<label className="partner-range-select"><PiCalendar /><select value={range} onChange={(event) => setRange(event.target.value)}><option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option></select><PiCaretDown /></label>}
      />
      <div className="partner-metric-grid">
        <MetricCard label="Gross sales" value="₹8.72L" change="+16.8% vs previous period" icon={<PiCurrencyInr />} />
        <MetricCard label="Completed orders" value="2,418" change="+12.6% vs previous period" icon={<PiShoppingBag />} />
        <MetricCard label="Average order value" value="₹361" change="+₹14 per order" icon={<PiReceipt />} />
        <MetricCard label="Repeat customers" value="43%" change="+4.1 percentage points" icon={<PiUsers />} />
      </div>

      <div className="partner-analytics-grid">
        <PartnerPanel className="partner-sales-report">
          <PanelHeading title="Sales by week" description={`${range} · gross order value and completed orders`} />
          <div className="partner-report-table-wrap">
            <table className="partner-table">
              <thead><tr><th>Week</th><th>Orders</th><th>Average order</th><th>Gross sales</th><th>Change</th></tr></thead>
              <tbody>
                {[
                  ['24–29 Aug', '492', '₹378', '₹1,85,976', '+18.4%'],
                  ['17–23 Aug', '471', '₹359', '₹1,69,089', '+9.7%'],
                  ['10–16 Aug', '458', '₹355', '₹1,62,590', '+5.2%'],
                  ['3–9 Aug', '439', '₹348', '₹1,52,772', '+2.8%'],
                  ['27 Jul–2 Aug', '412', '₹347', '₹1,42,964', '—'],
                ].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : index === 4 && cell !== '—' ? <StatusBadge tone="success">{cell}</StatusBadge> : cell}</td>)}</tr>)}
              </tbody>
            </table>
          </div>
        </PartnerPanel>

        <PartnerPanel className="partner-customer-funnel">
          <PanelHeading title="Customer funnel" description="How restaurant visitors became orders." />
          <div className="partner-funnel-list">
            <span><small>Restaurant views</small><strong>18,430</strong><progress max="18430" value="18430" /></span>
            <span><small>Menu opens</small><strong>12,840</strong><progress max="18430" value="12840" /><b>69.7%</b></span>
            <span><small>Added an item</small><strong>4,196</strong><progress max="18430" value="4196" /><b>32.7%</b></span>
            <span><small>Placed an order</small><strong>2,418</strong><progress max="18430" value="2418" /><b>57.6%</b></span>
          </div>
          <aside className="partner-insight-note"><PiLightning /><div><strong>Your checkout conversion improved.</strong><p>Customers who add an item are 6.2% more likely to complete payment than last month.</p></div></aside>
        </PartnerPanel>

        <PartnerPanel className="partner-top-items">
          <PanelHeading title="Top-performing items" description="Ranked by completed order value." action={<Link to="/partner/menu">Manage menu <PiArrowRight /></Link>} />
          <div className="partner-top-item-list">
            {topItems.map(([name, orders, sales, score], index) => <article key={name}><span>{index + 1}</span><div><strong>{name}</strong><small>{orders}</small></div><meter min="0" max="100" value={Number(score)}>{score}</meter><strong>{sales}</strong></article>)}
          </div>
        </PartnerPanel>

        <PartnerPanel className="partner-operations-report">
          <PanelHeading title="Operations" description="Signals that affect ranking and customer trust." />
          <div className="partner-operation-metrics">
            <article><span><PiCheckCircle /></span><div><small>Order acceptance</small><strong>98.2%</strong><p>Target above 97%</p></div></article>
            <article><span><PiClock /></span><div><small>Average prep time</small><strong>18 min</strong><p>2 minutes faster</p></div></article>
            <article><span><PiWarning /></span><div><small>Restaurant cancellations</small><strong>1.4%</strong><p>Within healthy range</p></div></article>
            <article><span><PiStar /></span><div><small>Complaint rate</small><strong>0.8%</strong><p>Down 0.3 points</p></div></article>
          </div>
        </PartnerPanel>
      </div>
    </section>
  )
}

export function PartnerPayoutsPage() {
  const { showToast } = useApp()
  return (
    <section className="partner-page">
      <PageIntro eyebrow="Finance" title="Payouts" description="Track settlements, deductions and downloadable financial reports." actions={<button className="partner-button partner-button--secondary" type="button" onClick={() => showToast('Tax report prepared for download')}><PiDownloadSimple /> Download tax report</button>} />
      <div className="partner-payout-hero">
        <PartnerPanel className="partner-next-payout">
          <span className="partner-next-payout__icon"><PiWallet /></span>
          <div><small>Next payout · 31 August</small><strong>₹1,48,260</strong><p>Estimated settlement for 25–30 August · 438 completed orders</p></div>
          <StatusBadge tone="info">Processing</StatusBadge>
        </PartnerPanel>
        <PartnerPanel className="partner-payout-account">
          <span><PiBriefcase /></span>
          <div><small>Settlement account</small><strong>Spice Story Hospitality</strong><p>HDFC Bank · •••• 7842</p></div>
          <Link to="/partner/profile">Manage</Link>
        </PartnerPanel>
      </div>
      <div className="partner-metric-grid">
        <MetricCard label="Gross order value" value="₹1,92,480" change="Current settlement" icon={<PiMoney />} />
        <MetricCard label="Platform & delivery" value="₹38,496" change="20.0% of gross" icon={<PiReceipt />} />
        <MetricCard label="Taxes & adjustments" value="₹5,724" change="Includes TDS and GST" icon={<PiListBullets />} />
        <MetricCard label="Net payout" value="₹1,48,260" change="Expected 31 August" icon={<PiWallet />} />
      </div>
      <PartnerPanel>
        <PanelHeading title="Settlement history" description="Weekly payouts for this outlet." action={<button className="partner-text-button" type="button" onClick={() => showToast('Settlement filters opened')}>Filter statements <PiCaretDown /></button>} />
        <div className="partner-report-table-wrap">
          <table className="partner-table partner-payout-table">
            <thead><tr><th>Settlement</th><th>Period</th><th>Orders</th><th>Gross value</th><th>Deductions</th><th>Net payout</th><th>Status</th><th><span className="sr-only">Download</span></th></tr></thead>
            <tbody>{payoutRows.map((row) => <tr key={row.id}><td><strong>{row.id}</strong></td><td>{row.period}</td><td>{row.orders}</td><td>{row.gross}</td><td>{row.deductions}</td><td><strong>{row.net}</strong></td><td><StatusBadge tone="success"><PiCheck /> {row.status}</StatusBadge></td><td><button className="partner-icon-button" type="button" aria-label={`Download ${row.id}`} onClick={() => showToast(`${row.id} statement downloaded`)}><PiDownloadSimple /></button></td></tr>)}</tbody>
          </table>
        </div>
      </PartnerPanel>
      <aside className="partner-alert partner-alert--info"><PiInfo /><div><strong>How settlements work</strong><p>QuickBite closes each weekly period on Sunday and sends the net amount to your verified bank account within two working days.</p></div><Link to="/partner/support">Learn more</Link></aside>
    </section>
  )
}

export function PartnerReviewsPage() {
  const { showToast } = useApp()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [reply, setReply] = useState('')

  const submitReply = (event: FormEvent, reviewId: string) => {
    event.preventDefault()
    if (!reply.trim()) return
    setReplyingTo(null)
    setReply('')
    showToast(`Reply posted for ${reviewId}`)
  }

  return (
    <section className="partner-page">
      <PageIntro eyebrow="Customer voice" title="Ratings and reviews" description="See what customers value and respond when service needs attention." />
      <div className="partner-review-overview">
        <PartnerPanel className="partner-rating-card">
          <div className="partner-rating-card__score"><strong>4.6</strong><Rating value={4.6} /><small>1,284 ratings</small></div>
          <div className="partner-rating-breakdown">
            {[[5, 72], [4, 19], [3, 6], [2, 2], [1, 1]].map(([stars, value]) => <span key={stars}><small>{stars} <PiStarFill /></small><progress max="100" value={value} /><strong>{value}%</strong></span>)}
          </div>
        </PartnerPanel>
        <div className="partner-metric-grid partner-metric-grid--compact">
          <MetricCard label="Food quality" value="4.7" change="+0.2 this month" icon={<PiForkKnife />} />
          <MetricCard label="Packaging" value="4.5" change="Stable" icon={<PiPackage />} />
          <MetricCard label="Positive reviews" value="91%" change="Past 30 days" icon={<PiSealCheck />} />
          <MetricCard label="Replies sent" value="84%" change="Within 24 hours" icon={<PiEnvelope />} />
        </div>
      </div>
      <PartnerPanel>
        <PanelHeading title="Recent feedback" description="Newest verified customer reviews." action={<select defaultValue="all" aria-label="Filter reviews"><option value="all">All ratings</option><option value="low">Needs a reply</option><option value="high">4–5 stars</option></select>} />
        <div className="partner-review-list">
          {reviewRows.map((review) => (
            <article key={review.id}>
              <header><span className="partner-review-avatar">{review.customer.split(' ').map((part) => part[0]).join('')}</span><div><strong>{review.customer}</strong><small>{review.date} · Order {review.order}</small></div><Rating value={review.rating} /></header>
              <p>{review.text}</p>
              <div className="partner-review-tags">{review.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              {replyingTo === review.id ? (
                <form className="partner-reply-form" onSubmit={(event) => submitReply(event, review.id)}><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Reply to ${review.customer}`} autoFocus /><div><button className="partner-button partner-button--ghost partner-button--small" type="button" onClick={() => setReplyingTo(null)}>Cancel</button><button className="partner-button partner-button--mint partner-button--small" type="submit">Post reply</button></div></form>
              ) : <button className="partner-text-button" type="button" onClick={() => setReplyingTo(review.id)}><PiNotePencil /> Reply publicly</button>}
            </article>
          ))}
        </div>
      </PartnerPanel>
    </section>
  )
}

export function PartnerProfilePage() {
  const { showToast } = useApp()
  const [profile, setProfile] = useState({
    restaurantName: 'Spice Story Cafe',
    businessName: 'Spice Story Hospitality',
    phone: '9876543210',
    email: 'operations@spicestory.example',
    address: '80 Feet Road, Koramangala 4th Block, Bengaluru 560034',
    cuisine: 'North Indian, Biryani, Cafe',
    fssai: '11223999000481',
    gstin: '29AAQCS7824K1Z7',
    accountName: 'Spice Story Hospitality',
    accountNumber: '0284010007842',
    ifsc: 'HDFC0000284',
  })
  const [updates, setUpdates] = useState(true)
  const [orderAlerts, setOrderAlerts] = useState(true)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    showToast('Outlet profile saved')
  }

  return (
    <section className="partner-page">
      <PageIntro eyebrow="Outlet settings" title="Outlet profile" description="Keep public restaurant, contact and settlement details current." />
      <form className="partner-profile-form" onSubmit={submit}>
        <PartnerPanel className="partner-profile-identity">
          <div className="partner-profile-photo"><img src="/assets/food/restaurant.jpg" alt="Spice Story Cafe storefront" /><button type="button" onClick={() => showToast('Photo uploader opened')}><PiUploadSimple /> Replace cover</button></div>
          <div><StatusBadge tone="success"><PiSealCheck /> Verified outlet</StatusBadge><h2>{profile.restaurantName}</h2><p>Restaurant ID QB-REST-1048 · Joined June 2025</p></div>
        </PartnerPanel>
        <div className="partner-profile-grid">
          <PartnerPanel>
            <PanelHeading title="Restaurant details" description="These details appear in customer-facing surfaces." />
            <div className="partner-form-grid">
              <label className="partner-field"><span>Restaurant name</span><input value={profile.restaurantName} onChange={(event) => setProfile({ ...profile, restaurantName: event.target.value })} /></label>
              <label className="partner-field"><span>Business name</span><input value={profile.businessName} onChange={(event) => setProfile({ ...profile, businessName: event.target.value })} /></label>
              <label className="partner-field partner-field--wide"><span>Primary cuisines</span><input value={profile.cuisine} onChange={(event) => setProfile({ ...profile, cuisine: event.target.value })} /></label>
              <label className="partner-field partner-field--wide"><span>Outlet address</span><textarea value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} /></label>
            </div>
          </PartnerPanel>
          <PartnerPanel>
            <PanelHeading title="Contact details" description="Used for service updates and operations support." />
            <div className="partner-form-grid">
              <label className="partner-field"><span>Operations phone</span><input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} /></label>
              <label className="partner-field"><span>Operations email</span><input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label>
            </div>
            <div className="partner-toggle-list">
              <ToggleControl checked={orderAlerts} onChange={setOrderAlerts} label="Order and outage alerts" description="Immediate SMS and email for operational events." />
              <ToggleControl checked={updates} onChange={setUpdates} label="Business tips and product updates" description="A weekly summary of relevant partner improvements." />
            </div>
          </PartnerPanel>
          <PartnerPanel>
            <PanelHeading title="Compliance" description="Verified registration documents for this outlet." action={<button className="partner-text-button" type="button" onClick={() => showToast('Compliance document uploader opened')}>Replace documents</button>} />
            <div className="partner-form-grid">
              <label className="partner-field"><span>FSSAI licence</span><input value={profile.fssai} onChange={(event) => setProfile({ ...profile, fssai: event.target.value })} /></label>
              <label className="partner-field"><span>GSTIN</span><input value={profile.gstin} onChange={(event) => setProfile({ ...profile, gstin: event.target.value.toUpperCase() })} /></label>
            </div>
            <div className="partner-document-list partner-document-list--compact"><span><PiCheckCircle /> FSSAI certificate<small>Verified · expires 14 Jun 2027</small></span><span><PiCheckCircle /> GSTIN certificate<small>Verified</small></span><span><PiCheckCircle /> PAN card<small>Verified</small></span></div>
          </PartnerPanel>
          <PartnerPanel>
            <PanelHeading title="Settlement account" description="Changes require a fresh bank verification." />
            <div className="partner-form-grid">
              <label className="partner-field partner-field--wide"><span>Account holder</span><input value={profile.accountName} onChange={(event) => setProfile({ ...profile, accountName: event.target.value })} /></label>
              <label className="partner-field"><span>Account number</span><input value={profile.accountNumber} onChange={(event) => setProfile({ ...profile, accountNumber: event.target.value })} /></label>
              <label className="partner-field"><span>IFSC code</span><input value={profile.ifsc} onChange={(event) => setProfile({ ...profile, ifsc: event.target.value.toUpperCase() })} /></label>
            </div>
          </PartnerPanel>
        </div>
        <div className="partner-sticky-save"><span><PiShieldCheck /> Sensitive updates are recorded in the audit history.</span><button className="partner-button partner-button--primary" type="submit">Save profile</button></div>
      </form>
    </section>
  )
}

export function PartnerSupportPage() {
  const { openOverlay, showToast } = useApp()
  const [openFaq, setOpenFaq] = useState(0)
  const [ticket, setTicket] = useState({ subject: '', details: '' })

  const submitTicket = (event: FormEvent) => {
    event.preventDefault()
    showToast('Support request QB-SUP-4821 created')
    setTicket({ subject: '', details: '' })
  }

  return (
    <section className="partner-page">
      <PageIntro eyebrow="Partner care" title="Support" description="Find operating answers or speak with the QuickBite partner team." actions={<button className="partner-button partner-button--mint" type="button" onClick={() => openOverlay('support-chat')}><PiHeadset /> Start live chat</button>} />
      <div className="partner-support-options">
        <article><span><PiHeadset /></span><div><strong>Live partner chat</strong><p>Typical response in under two minutes.</p></div><button type="button" onClick={() => openOverlay('support-chat')}>Chat now <PiArrowRight /></button></article>
        <article><span><PiPhone /></span><div><strong>Urgent order line</strong><p>For a live-order or rider handover issue.</p></div><a href="tel:18001234567">1800-123-4567 <PiArrowRight /></a></article>
        <article><span><PiEnvelope /></span><div><strong>Email support</strong><p>For documents, payouts and non-urgent requests.</p></div><a href="mailto:partners@quickbite.example">Send email <PiArrowRight /></a></article>
      </div>
      <div className="partner-support-grid">
        <PartnerPanel>
          <PanelHeading title="Frequently asked questions" description="Quick answers for common restaurant operations." />
          <div className="partner-faq-list">
            {supportFaqs.map(([question, answer], index) => <article key={question} className={openFaq === index ? 'is-open' : ''}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><PiCaretDown /></button>{openFaq === index && <p>{answer}</p>}</article>)}
          </div>
        </PartnerPanel>
        <PartnerPanel className="partner-ticket-builder">
          <PanelHeading title="Create a support request" description="Share enough context so the right specialist can help." />
          <form onSubmit={submitTicket}>
            <label className="partner-field"><span>Issue category</span><select required defaultValue=""><option value="" disabled>Select a category</option><option>Live order</option><option>Menu and availability</option><option>Payouts</option><option>Documents and profile</option><option>Offers and analytics</option></select></label>
            <label className="partner-field"><span>Subject</span><input value={ticket.subject} onChange={(event) => setTicket({ ...ticket, subject: event.target.value })} placeholder="A short summary" required /></label>
            <label className="partner-field"><span>Details</span><textarea value={ticket.details} onChange={(event) => setTicket({ ...ticket, details: event.target.value })} placeholder="Tell us what happened and what you have already tried" required /></label>
            <label className="partner-upload partner-upload--compact"><span className="partner-upload__icon"><PiUploadSimple /></span><span><strong>Add evidence</strong><small>Optional image or PDF</small></span><input type="file" /><span className="partner-button partner-button--secondary partner-button--small">Attach</span></label>
            <button className="partner-button partner-button--primary partner-button--full" type="submit">Submit request</button>
          </form>
        </PartnerPanel>
      </div>
      <PartnerPanel>
        <PanelHeading title="Recent requests" />
        <div className="partner-report-table-wrap"><table className="partner-table"><thead><tr><th>Request</th><th>Topic</th><th>Created</th><th>Status</th><th>Last update</th></tr></thead><tbody><tr><td><strong>QB-SUP-4794</strong></td><td>Missing payout adjustment</td><td>26 Aug</td><td><StatusBadge tone="success">Resolved</StatusBadge></td><td>27 Aug, 3:48 PM</td></tr><tr><td><strong>QB-SUP-4678</strong></td><td>Update FSSAI document</td><td>18 Aug</td><td><StatusBadge tone="info">Completed</StatusBadge></td><td>19 Aug, 11:20 AM</td></tr></tbody></table></div>
      </PartnerPanel>
    </section>
  )
}

export function DeliveryPartnerLandingPage() {
  return (
    <MarketingPage>
      <main className="partner-marketing delivery-marketing">
      <section className="partner-marketing__hero delivery-marketing__hero">
        <div className="partner-marketing__copy">
          <span className="partner-kicker">Deliver with QuickBite</span>
          <h1>Earn on your time, close to home.</h1>
          <p>Choose flexible delivery hours, see clear weekly earnings and get support throughout every shift.</p>
          <div className="partner-marketing__actions"><Link className="partner-button partner-button--primary" to="/delivery-partner/apply">Apply to deliver <PiArrowRight /></Link><a className="partner-button partner-button--secondary" href="#delivery-faq">Read FAQs</a></div>
          <div className="partner-marketing__proof"><span><strong>Weekly</strong><small>bank payouts</small></span><span><strong>Flexible</strong><small>work schedule</small></span><span><strong>Local</strong><small>delivery zones</small></span></div>
        </div>
        <div className="partner-marketing__visual delivery-marketing__visual"><img src="/assets/people/restaurant-partner.jpg" alt="QuickBite delivery partner ready for work" /><article><span><PiWallet /></span><div><strong>₹7,480 this week</strong><small>Illustrative partner earnings</small></div></article></div>
      </section>
      <section className="partner-marketing__section">
        <header className="partner-marketing__section-heading"><span className="partner-kicker">How it works</span><h2>Start delivering in three simple steps.</h2></header>
        <div className="delivery-step-grid"><article><span>1</span><PiUser /><h3>Create your profile</h3><p>Tell us your city, preferred vehicle and contact details.</p></article><article><span>2</span><PiReceipt /><h3>Upload documents</h3><p>Identity, PAN, bank details and a licence when required.</p></article><article><span>3</span><PiLightning /><h3>Complete onboarding</h3><p>Finish a short orientation, choose a zone and start earning.</p></article></div>
      </section>
      <section className="partner-marketing__section delivery-faq" id="delivery-faq">
        <div><span className="partner-kicker">What you need</span><h2>Documents for a smooth application.</h2><p>Aadhaar or voter ID, PAN, bank proof and a valid driving licence for motorised vehicles.</p></div>
        <PartnerPanel><h3>Built around your day</h3><p><PiCheckCircle /> Choose full-time or part-time shifts</p><p><PiCheckCircle /> Deliver in nearby service areas</p><p><PiCheckCircle /> Track orders, incentives and payouts</p><p><PiCheckCircle /> Access rider support during every shift</p><Link className="partner-button partner-button--mint" to="/delivery-partner/apply">Get started</Link></PartnerPanel>
      </section>
      </main>
    </MarketingPage>
  )
}

export function DeliveryPartnerApplyPage() {
  const { showToast } = useApp()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [details, setDetails] = useState({ name: 'Rahul Kumar', phone: '9876543210', city: 'Bengaluru', vehicle: 'Motorbike', zone: 'Koramangala' })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (step < deliveryApplicationSteps.length) {
      setStep((current) => current + 1)
      return
    }
    setSubmitted(true)
    showToast('Delivery partner application submitted')
  }

  if (submitted) {
    return (
      <main className="delivery-apply-page">
        <PartnerPanel className="delivery-success-card">
          <span><PiCheckCircle /></span><span className="partner-kicker">Application QB-DP-31842</span><h1>Thanks, {details.name.split(' ')[0]}.</h1><p>Your delivery partner application is in review. We will send the next steps to {details.phone} within two working days.</p><div><strong>What happens next?</strong><small>Identity check</small><PiArrowRight /><small>Orientation</small><PiArrowRight /><small>Choose shifts</small></div><Link className="partner-button partner-button--primary" to="/">Return to QuickBite</Link>
        </PartnerPanel>
      </main>
    )
  }

  return (
    <main className="partner-application-page delivery-apply-page">
      <header className="partner-application-header"><Link to="/delivery-partner"><PiArrowLeft /> Delivery partner overview</Link><span>Secure application</span></header>
      <section className="partner-application-shell">
        <div className="partner-application-title"><span className="partner-kicker">Delivery partner application</span><h1>Tell us how you want to deliver.</h1><p>Complete the three short sections below. Your information stays private.</p></div>
        <StepRail steps={deliveryApplicationSteps} current={step} />
        <form className="partner-application-form" onSubmit={submit}>
          {step === 1 && <PartnerPanel><PanelHeading title="Basic details" description="Use a mobile number you can access during onboarding." /><div className="partner-form-grid"><label className="partner-field"><span>Full name</span><input value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} required /></label><label className="partner-field"><span>Mobile number</span><input value={details.phone} onChange={(event) => setDetails({ ...details, phone: event.target.value })} required /></label><label className="partner-field"><span>City</span><select value={details.city} onChange={(event) => setDetails({ ...details, city: event.target.value })}><option>Bengaluru</option><option>Hyderabad</option><option>Chennai</option><option>Mumbai</option></select></label><label className="partner-field"><span>Preferred delivery area</span><select value={details.zone} onChange={(event) => setDetails({ ...details, zone: event.target.value })}><option>Koramangala</option><option>Indiranagar</option><option>HSR Layout</option><option>Jayanagar</option></select></label><label className="partner-field partner-field--wide"><span>Vehicle</span><div className="partner-choice-grid">{['Motorbike', 'Electric bike', 'Bicycle'].map((vehicle) => <button key={vehicle} type="button" className={details.vehicle === vehicle ? 'is-selected' : ''} onClick={() => setDetails({ ...details, vehicle })}><PiLightning /><strong>{vehicle}</strong><small>{vehicle === 'Bicycle' ? 'No driving licence needed' : 'Valid licence required'}</small></button>)}</div></label></div></PartnerPanel>}
          {step === 2 && <PartnerPanel><PanelHeading title="Documents" description="Upload clear images or PDFs. You can replace them before submission." /><div className="partner-upload-grid">{['Aadhaar or voter ID', 'PAN card', 'Driving licence', 'Bank account proof'].map((label) => <label className="partner-upload" key={label}><span className="partner-upload__icon"><PiCloudArrowUp /></span><span><strong>{label}</strong><small>{label === 'Driving licence' && details.vehicle === 'Bicycle' ? 'Not required for bicycle deliveries' : 'PDF, JPG or PNG · up to 5 MB'}</small></span><input type="file" /><span className="partner-button partner-button--secondary partner-button--small">Choose file</span></label>)}</div><aside className="partner-info-box"><PiShieldCheck /><div><strong>Secure verification</strong><p>QuickBite uses these documents only to confirm identity, eligibility and payouts.</p></div></aside></PartnerPanel>}
          {step === 3 && <PartnerPanel><PanelHeading title="Review your application" description="Check the details before submitting." /><div className="partner-review-summary"><article><span><PiUser /></span><div><small>Applicant</small><strong>{details.name}</strong><p>{details.phone}</p></div><button type="button" onClick={() => setStep(1)}>Edit</button></article><article><span><PiMapPin /></span><div><small>Delivery preference</small><strong>{details.zone}, {details.city}</strong><p>{details.vehicle}</p></div><button type="button" onClick={() => setStep(1)}>Edit</button></article><article><span><PiReceipt /></span><div><small>Documents</small><strong>4 upload slots reviewed</strong><p>Identity, PAN, licence and bank proof</p></div><button type="button" onClick={() => setStep(2)}>Edit</button></article></div><label className="partner-check-row"><input type="checkbox" required defaultChecked /><span>I confirm that the information is correct and consent to identity and eligibility verification.</span></label></PartnerPanel>}
          <footer className="partner-form-actions"><button className="partner-button partner-button--secondary" type="button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}><PiArrowLeft /> Back</button><button className="partner-button partner-button--primary" type="submit">{step === deliveryApplicationSteps.length ? 'Submit application' : 'Continue'} <PiArrowRight /></button></footer>
        </form>
      </section>
    </main>
  )
}
