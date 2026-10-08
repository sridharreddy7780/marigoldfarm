import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Check, CircleAlert, MessageCircle, Phone } from 'lucide-react'
import { formatPrice } from '../data/products'
import { DirectionsButton } from './Buttons'
import { telUrl, whatsappUrl } from '../utils/whatsapp'
import { orderItems, pendingKey, resultKey } from '../utils/orderSession'

function readSessionValue(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null') } catch { return null }
}

function SupportLinks({ message }) {
  return (
    <div className="result-actions">
      <a className="btn btn--primary" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> WhatsApp Order Details</a>
      <a className="btn btn--outline" href={telUrl}><Phone size={19} /> Call Now</a>
      <DirectionsButton variant="outline" />
    </div>
  )
}

export function OrderStatusPage() {
  const [order] = useState(() => readSessionValue(resultKey))
  const isPaid = order?.paymentStatus === 'paid'
  const navigate = useNavigate()
  useEffect(() => { if (!order) navigate('/cart', { replace: true }) }, [navigate, order])
  if (!order) return null

  const message = [
    'Hello Manohar Reddy,',
    isPaid ? 'I have placed an order.' : 'I placed an order for Banti flowers.',
    '',
    `Order ID: ${order.orderId}`,
    orderItems(order),
    '',
    `Total: ${formatPrice(order.total)}`,
    `Payment Method: ${isPaid ? 'Paid' : 'Pay at Farm'}`,
    `Customer Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.village}`,
    '',
    'Please confirm availability.',
  ].join('\n')

  return (
    <main className="result-page">
      <div className="result-mark"><Check size={34} aria-hidden="true" /></div>
      <p className="eyebrow">{isPaid ? 'PAYMENT SUCCESSFUL' : 'ORDER RECEIVED'}</p>
      <h1>{isPaid ? 'మీ కొనుగోలుకు ధన్యవాదాలు!' : 'ఆర్డర్ స్వీకరించబడింది'}</h1>
      <p className="result-page__english">{isPaid ? 'Thank you for your purchase!' : 'Thank you for your order.'}</p>
      <p className="result-page__support">మీ ఆర్డర్‌ను నిర్ధారించడానికి మా బృందం కొన్ని నిమిషాల్లో మిమ్మల్ని సంప్రదిస్తుంది.<br />We will contact you within a few minutes to confirm your order.</p>
      <div className="result-summary">
        <div><span>Order ID</span><strong>{order.orderId}</strong></div>
        <div><span>Payment</span><strong>{isPaid ? 'Paid' : 'Pay at Farm · Pending'}</strong></div>
        <div><span>Order status</span><strong>{isPaid ? 'Confirmed' : 'Pending confirmation'}</strong></div>
        <div><span>Total</span><strong>{formatPrice(order.total)}</strong></div>
        <ul>{order.items.map((item) => <li key={item.id}>{item.name}: {item.quantity} {item.unit}</li>)}</ul>
      </div>
      <SupportLinks message={message} />
      <Link className="result-continue" to="/">Continue Shopping</Link>
    </main>
  )
}

export function PaymentProblemPage({ cancelled = false }) {
  const navigate = useNavigate()
  const [pending] = useState(() => readSessionValue(pendingKey))
  const message = cancelled ? 'Payment Cancelled' : 'Payment Not Completed'
  return (
    <main className="result-page result-page--problem">
      <div className="result-mark result-mark--problem"><CircleAlert size={32} aria-hidden="true" /></div>
      <p className="eyebrow">ORDER NOT PAID</p>
      <h1>{message}</h1>
      <p className="result-page__support">Your order has not been paid. You can try again or choose Pay at Farm.</p>
      <div className="result-actions">
        <button className="btn btn--green" type="button" onClick={() => navigate('/checkout', { state: { paymentMethod: 'pay_now', customer: pending?.customer } })}>Try Payment Again</button>
        <button className="btn btn--gold" type="button" onClick={() => navigate('/checkout', { state: { paymentMethod: 'pay_at_farm', customer: pending?.customer } })}>Pay at Farm</button>
        <a className="btn btn--outline" href={telUrl}><Phone size={18} /> Call Now</a>
        <a className="btn btn--outline" href={whatsappUrl()} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> WhatsApp</a>
        <DirectionsButton variant="outline" />
      </div>
    </main>
  )
}