import Photo from './Photo'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { products, productPriceNote, formatPrice, maxQuantityPerProduct } from '../data/products'
import { useCart } from '../context/useCart'
export default function FlowerSection() {
  const [quantities, setQuantities] = useState(() => Object.fromEntries(products.map(({ id }) => [id, 1])))
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const updateQuantity = (id, change) => setQuantities((current) => ({
    ...current,
    [id]: Math.max(1, Math.min(maxQuantityPerProduct, current[id] + change)),
  }))

  return (
    <section className="section" id="flowers">
      <div className="container">
        <div className="head reveal">
          <h2>మా బంతి పూలు</h2>
          <p>Fresh Farm Marigolds</p>
        </div>
      </div>
      {products.map((product, n) => (
        <article key={product.id} className={`flower container reveal ${n % 2 ? 'flower--flip' : ''}`}>
          <div className="flower__media"><Photo name={product.image} alt={`Fresh ${product.name.toLowerCase()} marigold flowers`} /></div>
          <div className="flower__body">
            <h3>{product.name}<span>{product.teluguName}</span></h3>
            <p>{product.description}</p>
            <p className="product__price"><strong>{formatPrice(product.pricePerUnit)} / {product.unit}</strong></p>
            <div className="quantity-control" aria-label={`Quantity of ${product.name}`}>
              <span>How many kg?</span>
              <div className="quantity-control__input">
                <button type="button" aria-label={`Remove one kg of ${product.name}`} disabled={quantities[product.id] <= 1} onClick={() => updateQuantity(product.id, -1)}><Minus size={18} /></button>
                <output aria-live="polite">{quantities[product.id]}</output>
                <button type="button" aria-label={`Add one kg of ${product.name}`} disabled={quantities[product.id] >= maxQuantityPerProduct} onClick={() => updateQuantity(product.id, 1)}><Plus size={18} /></button>
              </div>
              <span>kg</span>
            </div>
            <button className="btn btn--green product__order" type="button" onClick={() => { addToCart(product.id, quantities[product.id]); navigate('/cart') }}>
              Order Now <ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className="product__note">{productPriceNote}</p>
            <p className="product__bulk">For bulk orders above 100 kg, <a href="tel:+916302126873">call for bulk order</a>.</p>
          </div>
        </article>
      ))}
    </section>
  )
}
