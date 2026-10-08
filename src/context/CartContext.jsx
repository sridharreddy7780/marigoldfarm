import { useEffect, useState } from 'react'
import { maxQuantityPerProduct, products } from '../data/products'
import { CartContext } from './cartContext'

const storageKey = 'marigold-farm-cart-v1'
const productIds = new Set(products.map((product) => product.id))

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
    return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) =>
      productIds.has(id) && Number.isInteger(quantity) && quantity >= 1 && quantity <= maxQuantityPerProduct,
    ))
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart)

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(cart)) } catch {}
  }, [cart])

  const setQuantity = (id, quantity) => {
    if (!productIds.has(id) || !Number.isInteger(quantity)) return
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: Math.min(quantity, maxQuantityPerProduct) }
    })
  }

  const addToCart = (id, quantity) => {
    if (!productIds.has(id) || !Number.isInteger(quantity)) return
    setCart((current) => ({
      ...current,
      [id]: Math.min((current[id] || 0) + quantity, maxQuantityPerProduct),
    }))
  }

  const clearCart = () => setCart({})
  const itemCount = Object.keys(cart).length

  return (
    <CartContext.Provider value={{ cart, itemCount, setQuantity, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

