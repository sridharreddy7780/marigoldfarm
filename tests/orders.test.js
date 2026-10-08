import test from 'node:test'
import assert from 'node:assert/strict'
import { buildOrder, RequestError } from '../api/_lib/orders.js'

const customer = {
  name: 'Ravi',
  phone: '+91 6302126873',
  address: '12 Farm Road',
  village: 'Raviryala',
}

test('calculates combined order totals from server-side prices and normalizes +91 phones', () => {
  const order = buildOrder({
    customer,
    items: [
      { id: 'yellow-banti', quantity: 10, pricePerUnit: 1 },
      { id: 'orange-banti', quantity: 5, pricePerUnit: 999999 },
    ],
    total: 1,
  }, 'pay_at_farm')

  assert.equal(order.customer.phone, '6302126873')
  assert.equal(order.items[0].pricePerUnit, 100)
  assert.equal(order.total, 1500)
  assert.equal(order.paymentStatus, 'pending')
  assert.equal(order.orderStatus, 'pending_confirmation')
})

test('rejects fractional, zero, and over-limit quantities', () => {
  for (const quantity of [0, 1.5, 101]) {
    assert.throws(() => buildOrder({ customer, items: [{ id: 'yellow-banti', quantity }] }, 'pay_at_farm'), RequestError)
  }
})

test('rejects unknown products and invalid Indian mobile numbers', () => {
  assert.throws(() => buildOrder({ customer, items: [{ id: 'unknown', quantity: 1 }] }, 'pay_at_farm'), RequestError)
  assert.throws(() => buildOrder({ customer: { ...customer, phone: '12345' }, items: [{ id: 'yellow-banti', quantity: 1 }] }, 'pay_at_farm'), RequestError)
})

test('requires address, name, and village before creating an order', () => {
  assert.throws(() => buildOrder({ customer: { ...customer, name: ' ' }, items: [{ id: 'yellow-banti', quantity: 1 }] }, 'pay_at_farm'), RequestError)
})