import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Photo from './Photo'
import { formatPrice, maxQuantityPerProduct, products } from '../data/products'
import { useCart } from '../context/useCart'

export default function CartPage() {
  const { cart, setQuantity } = useCart()
  const navigate = useNavigate()
  const items = products.filter(({ id }) => cart[id]).map((product) => ({
    ...product,
    quantity: cart[product.id],
    subtotal: product.pricePerUnit * cart[product.id],
  }))
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <main className="transaction-page">
      <Link className="back-link" to="/"><ArrowLeft size={18} /> Continue shopping</Link>
      <header className="transaction-heading">
        <p className="eyebrow">YOUR SELECTION</p>
        <h1>మీ ఆర్డర్</h1>
        <p>Your Order</p>
      </header>
      {items.length === 0 ? (
        <div className="empty-cart">
          <ShoppingBag size={34} aria-hidden="true" />
          <h2>Your cart is empty</h2>
          <p>Choose fresh Banti flowers to start an order.</p>
          <Link className="btn btn--green" to="/#flowers">Browse flowers</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item__photo"><Photo name={item.image} alt={`${item.name} flowers`} /></div>
                <div className="cart-item__body">
                  <div className="cart-item__title">
                    <div><h2>{item.name}</h2><p>{item.teluguName}</p></div>
                    <button className="icon-button cart-item__remove" type="button" onClick={() => setQuantity(item.id, 0)} aria-label={`Remove ${item.name}`}><Trash2 size={18} /></button>
                  </div>
                  <p className="cart-item__unit">{formatPrice(item.pricePerUnit)} / {item.unit} × {item.quantity} {item.unit} = <strong>{formatPrice(item.subtotal)}</strong></p>
                  <div className="cart-quantity">
                    <span>Quantity</span>
                    <div className="quantity-control__input">
                      <button type="button" aria-label={`Remove one kg of ${item.name}`} disabled={item.quantity <= 1} onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                      <output aria-live="polite">{item.quantity}</output>
                      <button type="button" aria-label={`Add one kg of ${item.name}`} disabled={item.quantity >= maxQuantityPerProduct} onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                    </div>
                    <span>kg</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="order-total">
            <div className="order-total__line"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
            <div className="order-total__line order-total__grand"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <p>Wholesale orders welcome. For more than 100 kg of one variety, please call directly.</p>
            <button className="btn btn--green" type="button" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          </aside>
        </>
      )}
    </main>
  )
}