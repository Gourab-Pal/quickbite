import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  PiArrowRight,
  PiBuildings,
  PiChartLineUp,
  PiClock,
  PiForkKnife,
  PiHeadset,
  PiLightning,
  PiMagnifyingGlass,
  PiMapPin,
  PiShieldCheck,
  PiStarFill,
  PiStorefront,
} from 'react-icons/pi'
import { MarketingFooter, MarketingHeader } from '../../layouts'
import { EmptyState, PageIntro, SearchField } from '../../components/Common'
import { useApp } from '../../context/AppContext'

export function HomePage() {
  return (
    <div className="app-shell">
      <MarketingHeader />
      <main>
        <section className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Your neighbourhood, delivered</span>
              <h1>Great food.<br />Right when you want it.</h1>
              <p>Discover neighbourhood restaurants and get your favourites delivered fresh, fast and exactly when you need them.</p>
              <div className="hero-actions"><Link className="primary-cta" to="/restaurants">Explore restaurants <PiArrowRight /></Link><Link className="secondary-cta" to="/partner">Grow with QuickBite</Link></div>
              <div className="hero-stats"><div><strong>100+</strong><span>restaurants</span></div><div><strong>30 min</strong><span>average delivery</span></div><div><strong>4.8/5</strong><span>customer rating</span></div></div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrap"><img src="/assets/food/pizza.jpg" alt="Freshly baked vegetable pizza" /></div>
              <div className="floating-card delivery-time-card"><span className="floating-icon mint-icon"><PiClock /></span><span><strong>24 min</strong><small>Lightning delivery</small></span></div>
              <div className="floating-card rating-card"><span className="floating-icon purple-icon"><PiStarFill /></span><span><strong>4.9</strong><small>Customer rating</small></span></div>
            </div>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading"><span>Everything in one place</span><h2>What brings you to QuickBite?</h2><p>One platform for customers, restaurant partners and the people keeping every order moving.</p></div>
          <div className="service-grid">
            <Link className="service-card food-service" to="/restaurants"><div className="service-copy"><span className="service-icon"><PiLightning /></span><h3>Food delivery</h3><p>Order from your favourite restaurants and get it delivered fast.</p><span className="service-link">Browse restaurants <PiArrowRight /></span></div><img src="/assets/food/indian-thali.jpg" alt="A table filled with delicious food" /></Link>
            <Link className="service-card partner-service" to="/partner"><div className="service-copy"><span className="service-icon"><PiStorefront /></span><h3>Restaurant partner</h3><p>Reach more customers and grow your business with QuickBite.</p><span className="service-link">Become a partner <PiArrowRight /></span></div><img src="/assets/people/restaurant-partner.jpg" alt="Restaurant owner standing in his kitchen" /></Link>
            <Link className="service-card admin-service" to="/admin"><div className="service-copy"><span className="service-icon"><PiChartLineUp /></span><h3>Admin control</h3><p>Manage restaurants, availability and operations in one place.</p><span className="service-link">Open dashboard <PiArrowRight /></span></div><img className="admin-preview-image" src="/assets/brand/admin-preview.svg" alt="QuickBite admin operations dashboard" /></Link>
          </div>
        </section>

        <section className="promise-section"><article><span className="promise-icon purple-icon"><PiLightning /></span><div><h3>Fast delivery</h3><p>Quick doorstep delivery, every time.</p></div></article><article><span className="promise-icon mint-icon"><PiShieldCheck /></span><div><h3>Safe & reliable</h3><p>Trusted restaurants and dependable service.</p></div></article><article><span className="promise-icon purple-icon"><PiHeadset /></span><div><h3>Always here for you</h3><p>Helpful support whenever you need us.</p></div></article></section>
      </main>
      <MarketingFooter />
    </div>
  )
}

export function AboutPage() {
  return <MarketingShell><section className="marketing-content"><PageIntro eyebrow="About QuickBite" title="We make everyday meals feel effortless." description="QuickBite connects customers, local restaurants and delivery partners through one dependable neighbourhood platform." /><div className="about-hero"><img src="/assets/food/restaurant.jpg" alt="A welcoming modern restaurant interior" /><div><h2>Built for every side of the table</h2><p>Our goal is simple: help customers discover great food, help restaurant owners grow sustainably and give operations teams the visibility they need.</p><div className="about-values"><Value icon={<PiForkKnife />} title="Food first" text="Quality, choice and honest restaurant information." /><Value icon={<PiStorefront />} title="Local growth" text="Tools that help neighbourhood restaurants thrive." /><Value icon={<PiShieldCheck />} title="Reliable by design" text="Clear status, secure checkout and responsive support." /></div></div></div><div className="company-stats"><div><strong>100+</strong><span>restaurant partners</span></div><div><strong>25K+</strong><span>happy customers</span></div><div><strong>6</strong><span>service areas</span></div><div><strong>4.8</strong><span>average rating</span></div></div></section></MarketingShell>
}

function Value({ icon, title, text }: { icon: ReactNode; title: string; text: string }) { return <article><span>{icon}</span><div><h3>{title}</h3><p>{text}</p></div></article> }

const jobs = [
  { slug: 'frontend-engineer', title: 'Frontend Engineer', team: 'Engineering', location: 'Bengaluru · Hybrid', summary: 'Build polished customer and partner experiences in React.' },
  { slug: 'backend-engineer', title: 'Backend Engineer — Java', team: 'Engineering', location: 'Bengaluru · Hybrid', summary: 'Design dependable Spring Boot services for orders and restaurants.' },
  { slug: 'product-designer', title: 'Product Designer', team: 'Design', location: 'Bengaluru · Hybrid', summary: 'Shape clear, useful food-ordering and operations workflows.' },
  { slug: 'restaurant-success', title: 'Restaurant Success Manager', team: 'Business', location: 'Bengaluru', summary: 'Help restaurant partners grow with QuickBite.' },
]

export function CareersPage() {
  const [query, setQuery] = useState('')
  const filtered = jobs.filter((job) => `${job.title} ${job.team}`.toLowerCase().includes(query.toLowerCase()))
  return <MarketingShell><section className="marketing-content"><PageIntro eyebrow="Careers" title="Help build the neighbourhood food platform." description="Join a small, thoughtful team working across customer experience, restaurant growth and dependable operations." /><div className="career-search"><SearchField value={query} onChange={setQuery} placeholder="Search roles or teams" /><button className="primary-button" type="button"><PiMagnifyingGlass /> Search jobs</button></div><div className="job-list">{filtered.map((job) => <Link key={job.slug} to={`/careers/${job.slug}`}><span>{job.team}</span><h2>{job.title}</h2><p>{job.summary}</p><small><PiMapPin /> {job.location}</small><PiArrowRight /></Link>)}</div></section></MarketingShell>
}

export function CareerDetailPage() {
  const { slug } = useParams()
  const job = jobs.find((entry) => entry.slug === slug)
  if (!job) return <NotFoundPage />
  return <MarketingShell><section className="marketing-content job-detail"><Link className="inline-link" to="/careers">← All roles</Link><PageIntro eyebrow={job.team} title={job.title} description={job.location} actions={<a className="primary-button" href="#apply">Apply for this role</a>} /><article><h2>What you’ll do</h2><ul><li>Own useful, high-quality product improvements from idea to release.</li><li>Work closely with engineering, design and operations partners.</li><li>Use customer and restaurant feedback to guide decisions.</li><li>Keep systems simple, observable and dependable.</li></ul><h2>What we’re looking for</h2><ul><li>Strong fundamentals and curiosity about how products work end to end.</li><li>Clear written communication and thoughtful collaboration.</li><li>Comfort learning unfamiliar systems one layer at a time.</li></ul></article><ApplyForm role={job.title} /></section></MarketingShell>
}

function ApplyForm({ role }: { role: string }) {
  const { showToast } = useApp()
  const submit = (event: FormEvent) => { event.preventDefault(); showToast('Application submitted successfully') }
  return <form className="application-form" id="apply" onSubmit={submit}><h2>Apply for {role}</h2><div className="form-grid"><label>Full name<input required /></label><label>Email<input type="email" required /></label><label>Phone<input required /></label><label>Portfolio or LinkedIn<input /></label></div><label>Why QuickBite?<textarea rows={5} required /></label><label>Resume<input type="file" accept=".pdf,.doc,.docx" /></label><button className="primary-button" type="submit">Submit application</button></form>
}

export function ContactPage() {
  const { showToast, openOverlay } = useApp()
  const submit = (event: FormEvent) => { event.preventDefault(); showToast('Message sent — we’ll reply shortly') }
  return <MarketingShell><section className="marketing-content"><PageIntro eyebrow="Contact" title="We’re here to help." description="Choose the quickest route for your question, or send our team a message." /><div className="contact-grid"><article><PiHeadset /><h2>Customer support</h2><p>Help with an active or previous order.</p><button className="text-button" type="button" onClick={() => openOverlay('support-chat')}>Start a conversation <PiArrowRight /></button></article><article><PiStorefront /><h2>Restaurant support</h2><p>Onboarding, menu, payout and account assistance.</p><Link className="inline-link" to="/partner/support">Partner help <PiArrowRight /></Link></article><article><PiBuildings /><h2>Business enquiries</h2><p>Partnerships, press and corporate questions.</p><a className="inline-link" href="mailto:hello@quickbite.com">hello@quickbite.com <PiArrowRight /></a></article></div><form className="contact-form" onSubmit={submit}><h2>Send us a message</h2><div className="form-grid"><label>Name<input required /></label><label>Email<input type="email" required /></label></div><label>Topic<select><option>General enquiry</option><option>Order support</option><option>Restaurant partnership</option><option>Press</option></select></label><label>Message<textarea rows={6} required /></label><button className="primary-button" type="submit">Send message</button></form></section></MarketingShell>
}

const policies = {
  terms: { eyebrow: 'Legal', title: 'Terms of service', intro: 'These terms explain the rules for using QuickBite’s customer, restaurant-partner and delivery services.', sections: [['Using QuickBite', 'You must provide accurate account and delivery information, use the platform lawfully and keep your account secure.'], ['Orders and availability', 'Restaurant availability, item prices and delivery estimates may change. An order is confirmed only after the restaurant accepts it.'], ['Payments', 'QuickBite may support cards, UPI and cash where available. Charges, taxes, fees and discounts are shown before order placement.'], ['Cancellations', 'Cancellation availability depends on order progress. Applicable charges are shown before you confirm cancellation.']] },
  privacy: { eyebrow: 'Privacy', title: 'Privacy and cookie policy', intro: 'This page describes the information QuickBite uses to provide and improve the service.', sections: [['Information we collect', 'Account details, saved addresses, order activity, support conversations and device information may be used to provide the service.'], ['How information is used', 'We use information for fulfilment, safety, support, fraud prevention and relevant product communication.'], ['Your choices', 'You can update profile information, remove saved addresses, adjust communications and request account deletion.'], ['Cookies', 'Essential cookies keep the service working. Preference and analytics cookies help remember choices and understand product usage.']] },
  refunds: { eyebrow: 'Support', title: 'Cancellation and refund policy', intro: 'Clear expectations for cancellations, missing items, quality concerns and payment reversals.', sections: [['Before confirmation', 'Orders cancelled before restaurant confirmation are normally refunded to the original payment method.'], ['After preparation begins', 'A cancellation fee may apply if food preparation has started. The applicable amount is shown before confirmation.'], ['Order issues', 'Report missing, damaged or incorrect items from the order-help page with supporting details when available.'], ['Refund timing', 'Approved refunds are initiated promptly. Banks and payment providers may take additional working days to reflect the amount.']] },
} as const

export function LegalPage({ type }: { type: keyof typeof policies }) {
  const policy = policies[type]
  return <MarketingShell><section className="marketing-content policy-page"><PageIntro eyebrow={policy.eyebrow} title={policy.title} description={`${policy.intro} Last updated: 29 August 2026.`} /><nav>{policy.sections.map(([title]) => <a key={title} href={`#${title.toLowerCase().replaceAll(' ', '-')}`}>{title}</a>)}</nav>{policy.sections.map(([title, body]) => <article key={title} id={title.toLowerCase().replaceAll(' ', '-')}><h2>{title}</h2><p>{body}</p><p>For questions about this section, contact hello@quickbite.com or use the Help centre.</p></article>)}</section></MarketingShell>
}

export function NotFoundPage() {
  return <MarketingShell><div className="marketing-content"><EmptyState title="This page took a wrong turn" description="The link may be outdated, or the page may have moved." action={<Link className="primary-button" to="/">Return home</Link>} /></div></MarketingShell>
}

function MarketingShell({ children }: { children: ReactNode }) { return <div className="app-shell"><MarketingHeader /><main>{children}</main><MarketingFooter /></div> }