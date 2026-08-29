import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PiArrowRight,
  PiCheck,
  PiCreditCard,
  PiHouse,
  PiMapPin,
  PiMinus,
  PiPaperPlaneTilt,
  PiPlus,
  PiShoppingBag,
  PiStar,
  PiUser,
  PiWallet,
  PiX,
} from 'react-icons/pi'
import { cityAreas, offers } from '../data'
import { useApp } from '../context/AppContext'
import type { Address, MenuItem, Order, Restaurant } from '../types'

type ItemPayload = { item: MenuItem; restaurant: Restaurant }
type ConfirmPayload = { title: string; description: string; confirmLabel?: string; danger?: boolean; onConfirm?: () => void }

function OverlayFrame({ kind, title, children, wide = false }: { kind: 'drawer' | 'modal'; title: string; children: ReactNode; wide?: boolean }) {
  const { closeOverlay } = useApp()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusables = panel?.querySelectorAll<HTMLElement>('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')
    focusables?.[0]?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOverlay()
      if (event.key === 'Tab' && focusables?.length) {
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKeyDown) }
  }, [closeOverlay])

  return (
    <div className="overlay-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && closeOverlay()}>
      <section ref={panelRef} className={`overlay-panel overlay-panel--${kind} ${wide ? 'overlay-panel--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button className="icon-button" type="button" onClick={closeOverlay} aria-label="Close"><PiX /></button></header>
        <div className="overlay-panel__body">{children}</div>
      </section>
    </div>
  )
}

function AuthDrawer() {
  const { signIn } = useApp()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('9876543210')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (step === 'phone') setStep('otp')
    else signIn(phone)
  }
  return (
    <OverlayFrame kind="drawer" title={step === 'phone' ? 'Sign in to QuickBite' : 'Verify your number'}>
      <div className="auth-illustration"><PiUser /></div>
      <p className="overlay-lead">{step === 'phone' ? 'Access saved addresses, order history and faster checkout.' : `Enter the six-digit code sent to +91 ${phone}.`}</p>
      <form className="stack-form" onSubmit={submit}>
        {step === 'phone' ? <label>Mobile number<div className="phone-input"><span>+91</span><input value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} required minLength={10} /></div></label> : <label>One-time password<input className="otp-input" defaultValue="123456" inputMode="numeric" maxLength={6} /></label>}
        <button className="primary-button full-width" type="submit">{step === 'phone' ? 'Continue' : 'Verify & sign in'} <PiArrowRight /></button>
      </form>
      <small className="legal-note">By continuing, you agree to QuickBite’s Terms and Privacy Policy.</small>
    </OverlayFrame>
  )
}

function LocationDrawer() {
  const { selectedLocation, setSelectedLocation, closeOverlay } = useApp()
  const [search, setSearch] = useState('')
  const choices = cityAreas.filter((area) => area.toLowerCase().includes(search.toLowerCase()))
  return (
    <OverlayFrame kind="drawer" title="Choose delivery location">
      <label className="overlay-search"><PiMapPin /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search area or landmark" /></label>
      <button className="current-location" type="button" onClick={() => { setSelectedLocation('Current location, Bengaluru'); closeOverlay() }}><PiMapPin /><span><strong>Use current location</strong><small>Using your device location</small></span></button>
      <div className="location-list"><h3>Popular areas</h3>{choices.map((area) => <button key={area} type="button" className={selectedLocation.startsWith(area) ? 'selected' : ''} onClick={() => { setSelectedLocation(`${area}, Bengaluru`); closeOverlay() }}><span><strong>{area}</strong><small>Bengaluru, Karnataka</small></span>{selectedLocation.startsWith(area) && <PiCheck />}</button>)}</div>
    </OverlayFrame>
  )
}

function FiltersDrawer() {
  const { closeOverlay, showToast } = useApp()
  const [sort, setSort] = useState('Relevance')
  const [veg, setVeg] = useState(false)
  return (
    <OverlayFrame kind="drawer" title="Filters & sorting">
      <div className="filter-group"><h3>Sort by</h3>{['Relevance', 'Delivery time', 'Rating', 'Cost: low to high', 'Cost: high to low'].map((choice) => <label key={choice}><input type="radio" name="sort" checked={sort === choice} onChange={() => setSort(choice)} /> {choice}</label>)}</div>
      <div className="filter-group"><h3>Preferences</h3><label><input type="checkbox" checked={veg} onChange={(event) => setVeg(event.target.checked)} /> Pure vegetarian</label><label><input type="checkbox" /> Rated 4.0+</label><label><input type="checkbox" /> Offers available</label><label><input type="checkbox" /> Delivery under 30 min</label></div>
      <div className="sticky-actions"><button className="secondary-button" type="button" onClick={() => { setSort('Relevance'); setVeg(false) }}>Clear all</button><button className="primary-button" type="button" onClick={() => { showToast('Filters applied'); closeOverlay() }}>Show restaurants</button></div>
    </OverlayFrame>
  )
}

function ItemModal({ payload }: { payload: ItemPayload }) {
  const { addItem, cart, cartRestaurant, closeOverlay } = useApp()
  const { item, restaurant } = payload
  const [size, setSize] = useState('Regular')
  const [extras, setExtras] = useState<string[]>([])
  const add = () => {
    const needsCartReplacement = Boolean(cart.length && cartRestaurant && cartRestaurant.id !== restaurant.id)
    addItem(item, restaurant, `${size}${extras.length ? ` · ${extras.join(', ')}` : ''}`)
    if (!needsCartReplacement) closeOverlay()
  }
  return (
    <OverlayFrame kind="modal" title="Customise your item" wide>
      <div className="item-modal__hero"><img src={item.image} alt={item.name} /><div><span className={item.veg ? 'food-marker food-marker--veg' : 'food-marker food-marker--nonveg'} /><h3>{item.name}</h3><p>{item.description}</p><strong>₹{item.price}</strong></div></div>
      <div className="option-group"><h3>Choose a size <small>Required</small></h3>{['Regular', 'Large + ₹80'].map((choice) => <label key={choice}><input type="radio" name="size" checked={size === choice} onChange={() => setSize(choice)} /><span>{choice}</span></label>)}</div>
      <div className="option-group"><h3>Add extras <small>Optional</small></h3>{['Extra cheese + ₹40', 'Spicy dip + ₹25', 'Crispy onions + ₹20'].map((choice) => <label key={choice}><input type="checkbox" checked={extras.includes(choice)} onChange={() => setExtras((current) => current.includes(choice) ? current.filter((entry) => entry !== choice) : [...current, choice])} /><span>{choice}</span></label>)}</div>
      <button className="primary-button full-width" type="button" onClick={add}>Add item · ₹{item.price + (size.startsWith('Large') ? 80 : 0)}</button>
    </OverlayFrame>
  )
}

function ReplaceCartModal() {
  const { confirmCartReplacement, closeOverlay } = useApp()
  return <OverlayFrame kind="modal" title="Start a new cart?"><p className="overlay-lead">Your cart contains items from another restaurant. QuickBite keeps one restaurant per order.</p><div className="modal-actions"><button className="secondary-button" type="button" onClick={closeOverlay}>Keep existing cart</button><button className="primary-button" type="button" onClick={confirmCartReplacement}>Replace cart</button></div></OverlayFrame>
}

function CartDrawer() {
  const navigate = useNavigate()
  const { cart, cartRestaurant, cartSubtotal, updateQuantity, closeOverlay } = useApp()
  return (
    <OverlayFrame kind="drawer" title="Your cart">
      {!cart.length ? <div className="drawer-empty"><PiShoppingBag /><h3>Your cart is empty</h3><p>Add something delicious from a nearby restaurant.</p><button className="primary-button" type="button" onClick={() => { closeOverlay(); navigate('/restaurants') }}>Browse restaurants</button></div> : <>
        <div className="cart-restaurant"><img src={cartRestaurant?.image} alt="" /><span><small>Ordering from</small><strong>{cartRestaurant?.name}</strong></span></div>
        <div className="mini-cart-list">{cart.map((line) => <article key={`${line.id}-${line.option}`}><span className={line.veg ? 'food-marker food-marker--veg' : 'food-marker food-marker--nonveg'} /><div><strong>{line.name}</strong>{line.option && <small>{line.option}</small>}<span>₹{line.price}</span></div><div className="quantity-stepper"><button type="button" onClick={() => updateQuantity(line.id, -1)}><PiMinus /></button><b>{line.quantity}</b><button type="button" onClick={() => updateQuantity(line.id, 1)}><PiPlus /></button></div></article>)}</div>
        <div className="mini-bill"><span>Subtotal <strong>₹{cartSubtotal}</strong></span><small>Taxes and delivery fee calculated at checkout.</small></div>
        <button className="primary-button full-width" type="button" onClick={() => { closeOverlay(); navigate('/cart') }}>View cart & checkout <PiArrowRight /></button>
      </>}
    </OverlayFrame>
  )
}

function CouponDrawer() {
  const { appliedOffer, applyOffer } = useApp()
  const [code, setCode] = useState('')
  return <OverlayFrame kind="drawer" title="Apply a coupon"><form className="coupon-entry" onSubmit={(event) => { event.preventDefault(); const offer = offers.find((entry) => entry.code === code.toUpperCase()); if (offer) applyOffer(offer) }}><input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Enter coupon code" /><button type="submit">Apply</button></form><div className="coupon-list">{offers.map((offer) => <article key={offer.id}><span>{offer.type}</span><h3>{offer.title}</h3><p>{offer.description}</p><code>{offer.code}</code><button type="button" disabled={appliedOffer?.id === offer.id} onClick={() => applyOffer(offer)}>{appliedOffer?.id === offer.id ? 'Applied' : 'Apply'}</button></article>)}</div></OverlayFrame>
}

function AddressModal({ payload }: { payload?: Address }) {
  const { saveAddress } = useApp()
  const [label, setLabel] = useState<Address['label']>(payload?.label ?? 'Home')
  const [line1, setLine1] = useState(payload?.line1 ?? '')
  const [line2, setLine2] = useState(payload?.line2 ?? '')
  const submit = (event: FormEvent) => { event.preventDefault(); saveAddress({ id: payload?.id ?? `addr-${Date.now()}`, label, line1, line2 }) }
  return <OverlayFrame kind="modal" title={payload ? 'Edit address' : 'Add delivery address'} wide><div className="map-preview"><PiMapPin /><span><strong>Place the pin accurately</strong><small>Koramangala, Bengaluru</small></span></div><form className="stack-form" onSubmit={submit}><label>House / flat / floor<input value={line1} onChange={(event) => setLine1(event.target.value)} required /></label><label>Area / landmark<input value={line2} onChange={(event) => setLine2(event.target.value)} required /></label><fieldset><legend>Save as</legend><div className="choice-row">{(['Home', 'Work', 'Other'] as const).map((choice) => <button className={label === choice ? 'selected' : ''} type="button" key={choice} onClick={() => setLabel(choice)}>{choice === 'Home' && <PiHouse />}{choice}</button>)}</div></fieldset><button className="primary-button full-width" type="submit">Save address</button></form></OverlayFrame>
}

function PaymentDrawer() {
  const { paymentMethod, setPaymentMethod, closeOverlay, showToast } = useApp()
  const choices = [{ icon: <PiWallet />, label: 'UPI · gourab@okaxis' }, { icon: <PiCreditCard />, label: 'Credit / debit card' }, { icon: <PiMoneyIcon />, label: 'Cash on delivery' }]
  return <OverlayFrame kind="drawer" title="Choose payment method"><div className="payment-list">{choices.map((choice) => <button type="button" key={choice.label} className={paymentMethod === choice.label ? 'selected' : ''} onClick={() => setPaymentMethod(choice.label)}>{choice.icon}<span><strong>{choice.label}</strong><small>Secure and protected payment</small></span>{paymentMethod === choice.label && <PiCheck />}</button>)}</div><button className="primary-button full-width" type="button" onClick={() => { closeOverlay(); showToast('Payment method updated') }}>Use this payment method</button></OverlayFrame>
}

function PiMoneyIcon() { return <span aria-hidden="true">₹</span> }

function CancelOrderModal({ payload }: { payload?: { orderId?: string } }) {
  const { closeOverlay, showToast } = useApp()
  const [reason, setReason] = useState('Ordered by mistake')
  return <OverlayFrame kind="modal" title={`Cancel order ${payload?.orderId ?? ''}?`}><p className="overlay-lead">Cancellation may not be available once the restaurant starts preparing your food.</p><div className="option-group">{['Ordered by mistake', 'Wrong delivery address', 'Need to change items', 'Delivery is taking too long'].map((choice) => <label key={choice}><input type="radio" name="cancel" checked={reason === choice} onChange={() => setReason(choice)} /> {choice}</label>)}</div><div className="modal-actions"><button className="secondary-button" type="button" onClick={closeOverlay}>Keep order</button><button className="danger-button" type="button" onClick={() => { closeOverlay(); showToast('Cancellation request submitted') }}>Cancel order</button></div></OverlayFrame>
}

function RatingModal({ payload }: { payload?: Order }) {
  const { closeOverlay, showToast } = useApp()
  const [rating, setRating] = useState(0)
  return <OverlayFrame kind="modal" title={`Rate ${payload?.restaurantName ?? 'your order'}`}><p className="overlay-lead">How was your food and delivery experience?</p><div className="rating-picker">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={value <= rating ? 'selected' : ''} onClick={() => setRating(value)} aria-label={`${value} stars`}><PiStar /></button>)}</div><textarea className="review-field" placeholder="Share more about your experience (optional)" /><button className="primary-button full-width" disabled={!rating} type="button" onClick={() => { closeOverlay(); showToast('Thanks for your feedback') }}>Submit review</button></OverlayFrame>
}

function SupportChatDrawer() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(['Hi Gourab, how can we help with your QuickBite experience?'])
  return <OverlayFrame kind="drawer" title="QuickBite support"><div className="chat-thread">{messages.map((entry, index) => <p key={`${entry}-${index}`} className={index ? 'chat-message chat-message--user' : 'chat-message'}>{entry}</p>)}</div><form className="chat-composer" onSubmit={(event) => { event.preventDefault(); if (!message.trim()) return; setMessages((current) => [...current, message.trim()]); setMessage('') }}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message" /><button type="submit" aria-label="Send"><PiPaperPlaneTilt /></button></form></OverlayFrame>
}

function ConfirmModal({ payload }: { payload?: ConfirmPayload }) {
  const { closeOverlay } = useApp()
  return <OverlayFrame kind="modal" title={payload?.title ?? 'Are you sure?'}><p className="overlay-lead">{payload?.description ?? 'Please confirm this action.'}</p><div className="modal-actions"><button className="secondary-button" type="button" onClick={closeOverlay}>Go back</button><button className={payload?.danger ? 'danger-button' : 'primary-button'} type="button" onClick={() => { payload?.onConfirm?.(); closeOverlay() }}>{payload?.confirmLabel ?? 'Confirm'}</button></div></OverlayFrame>
}

export function OverlayHost() {
  const { overlay, toast } = useApp()
  return <>{overlay?.type === 'auth' && <AuthDrawer />}{overlay?.type === 'location' && <LocationDrawer />}{overlay?.type === 'filters' && <FiltersDrawer />}{overlay?.type === 'item' && <ItemModal payload={overlay.payload as ItemPayload} />}{overlay?.type === 'replace-cart' && <ReplaceCartModal />}{overlay?.type === 'cart' && <CartDrawer />}{overlay?.type === 'coupons' && <CouponDrawer />}{overlay?.type === 'address' && <AddressModal payload={overlay.payload as Address | undefined} />}{overlay?.type === 'payment' && <PaymentDrawer />}{overlay?.type === 'cancel-order' && <CancelOrderModal payload={overlay.payload as { orderId?: string }} />}{overlay?.type === 'rating' && <RatingModal payload={overlay.payload as Order} />}{overlay?.type === 'support-chat' && <SupportChatDrawer />}{overlay?.type === 'confirm' && <ConfirmModal payload={overlay.payload as ConfirmPayload} />}{toast && <div className="toast" role="status"><PiCheck /> {toast}</div>}</>
}

export function CartSummaryLink() {
  const { cartCount, cartSubtotal } = useApp()
  if (!cartCount) return null
  return <Link className="mobile-cart-bar" to="/cart"><span><PiShoppingBag /> {cartCount} item{cartCount > 1 ? 's' : ''}</span><strong>₹{cartSubtotal} · View cart <PiArrowRight /></strong></Link>
}