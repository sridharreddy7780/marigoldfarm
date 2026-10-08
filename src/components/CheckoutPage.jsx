import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, MapPin, Phone, WalletCards } from 'lucide-react'
import { business } from '../data/business'
import { useCart } from '../context/useCart'
import { formatPrice, products } from '../data/products'
import { whatsappUrl } from '../utils/whatsapp'
import { pendingKey, resultKey } from '../utils/orderSession'
const initialCustomer = { name: '', phone: '', address: '', village: '', landmark: '', notes: '' }

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  return digits
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again or contact Manohar Reddy.')
  return data
}

function makeOrderPayload(cart, customer) {
  return {
    customer: { ...customer, phone: normalizePhone(customer.phone) },
    items: products.filter(({ id }) => cart[id]).map(({ id }) => ({ id, quantity: cart[id] })),
  }
}

function goToOrderResult(navigate, order) {
  sessionStorage.setItem(resultKey, JSON.stringify(order))
  navigate('/order-success')
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [customer, setCustomer] = useState(() => ({ ...initialCustomer, ...location.state?.customer }))
  const [paymentMethod, setPaymentMethod] = useState(location.state?.paymentMethod || 'pay_at_farm')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const items = products.filter(({ id }) => cart[id]).map((product) => ({
    ...product,
    quantity: cart[product.id],
    subtotal: product.pricePerUnit * cart[product.id],
  }))
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const changeField = (event) => setCustomer((current) => ({ ...current, [event.target.name]: event.target.value }))
  const validate = () => {
    if (!customer.name.trim()) return 'Please enter your name.'
    if (!/^(?:\+?91[\s-]?)?[6-9]\d{9}$/.test(customer.phone.trim())) return 'Please enter a valid 10-digit mobile number.'
    if (!customer.address.trim()) return 'Please enter your address.'
    if (!customer.village.trim()) return 'Please enter your village or city.'
    if (!items.length) return 'Your cart is empty. Add flowers before checkout.'
    return ''
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    const payload = makeOrderPayload(cart, customer)
    setBusy(true)
    try {
      if (paymentMethod === 'pay_at_farm') {
        const { order } = await postJson('/api/orders/pay-at-farm', payload)
        clearCart()
        goToOrderResult(navigate, order)
        return
      }

      const { order, keyId } = await postJson('/api/payments/create-order', payload)
      const scriptReady = await loadRazorpay()
      if (!scriptReady) throw new Error('Payment checkout could not load. Please try again or choose Pay at Farm.')
      sessionStorage.setItem(pendingKey, JSON.stringify({ ...payload, orderId: order.orderId }))
      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: business.name,
        description: 'Fresh Farm Marigolds',
        order_id: order.gatewayOrderId,
        prefill: { name: payload.customer.name, contact: payload.customer.phone },
        theme: { color: '#2F4A2B' },
        handler: async (response) => {
          try {
            const verified = await postJson('/api/payments/verify', {
              orderId: order.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            clearCart()
            sessionStorage.removeItem(pendingKey)
            goToOrderResult(navigate, verified.order)
          } catch {
            navigate('/payment-failed')
          }
        },
        modal: {
          ondismiss: () => {
            postJson('/api/payments/fail', { orderId: order.orderId, reason: 'cancelled' }).catch(() => {})
            navigate('/payment-cancelled')
          },
        },
      })
      checkout.on('payment.failed', () => {
        postJson('/api/payments/fail', { orderId: order.orderId, reason: 'failed' }).catch(() => {})
        navigate('/payment-failed')
      })
      checkout.open()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="transaction-page checkout-page">
      <Link className="back-link" to="/cart"><ArrowLeft size={18} /> Back to your order</Link>
      <header className="transaction-heading">
        <p className="eyebrow">FARMER MANOHAR REDDY</p>
        <h1>ఆర్డర్ పూర్తి చేయండి</h1>
        <p>Complete Your Order</p>
      </header>
      {!items.length ? (
        <div className="empty-cart"><h2>Your cart is empty</h2><Link className="btn btn--green" to="/#flowers">Choose flowers</Link></div>
      ) : (
        <form className="checkout-layout" onSubmit={submit} noValidate>
          <div className="checkout-form">
            <section className="checkout-section">
              <h2>Your details</h2>
              <label>Full Name <span>*</span><input name="name" autoComplete="name" value={customer.name} onChange={changeField} maxLength={100} required /></label>
              <label>Mobile Number <span>*</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit Indian mobile number" value={customer.phone} onChange={changeField} maxLength={16} required /></label>
              <label>Address <span>*</span><textarea name="address" autoComplete="street-address" rows="3" value={customer.address} onChange={changeField} maxLength={500} required /></label>
              <label>Village / City <span>*</span><input name="village" autoComplete="address-level2" value={customer.village} onChange={changeField} maxLength={100} required /></label>
              <label>Landmark <small>Optional</small><input name="landmark" value={customer.landmark} onChange={changeField} maxLength={200} /></label>
              <label>Order Notes <small>Optional</small><textarea name="notes" rows="2" value={customer.notes} onChange={changeField} maxLength={500} /></label>
            </section>
            <fieldset className="checkout-section payment-options">
              <legend>Payment option</legend>
              <label className={`payment-option ${paymentMethod === 'pay_now' ? 'is-selected' : ''}`}>
                <input type="radio" name="payment" value="pay_now" checked={paymentMethod === 'pay_now'} onChange={() => setPaymentMethod('pay_now')} />
                <WalletCards size={22} /><span><strong>Pay Now</strong><small>Secure payment via Razorpay</small></span>
              </label>
              <label className={`payment-option ${paymentMethod === 'pay_at_farm' ? 'is-selected' : ''}`}>
                <input type="radio" name="payment" value="pay_at_farm" checked={paymentMethod === 'pay_at_farm'} onChange={() => setPaymentMethod('pay_at_farm')} />
                <Home size={22} /><span><strong>Pay at Farm</strong><small>Payment handled directly at the farm</small></span>
              </label>
            </fieldset>
            {error && <p className="form-error" role="alert">{error} <a href={whatsappUrl()} target="_blank" rel="noreferrer">Contact Manohar Reddy</a></p>}
            <button className="btn btn--green checkout-submit" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : paymentMethod === 'pay_now' ? 'Continue to Secure Payment' : 'Place Order · Pay at Farm'}
            </button>
          </div>
          <aside className="checkout-summary">
            <h2>Order Summary</h2>
            {items.map((item) => (
              <div className="summary-item" key={item.id}>
                <div><strong>{item.name}</strong><span>{item.quantity} {item.unit} × {formatPrice(item.pricePerUnit)}</span></div>
                <strong>{formatPrice(item.subtotal)}</strong>
              </div>
            ))}
            <div className="order-total__line order-total__grand"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <p className="checkout-summary__note"><MapPin size={15} /> {business.landmarkEn}</p>
            <p className="checkout-summary__note"><Phone size={15} /> {business.phoneDisplay}</p>
          </aside>
        </form>
      )}
    </main>
  )
}