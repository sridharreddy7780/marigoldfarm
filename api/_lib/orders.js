import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto'
import Razorpay from 'razorpay'
import { maxQuantityPerProduct, products } from '../../src/data/products.js'

const productById = new Map(products.map((product) => [product.id, product]))
const textFields = {
  name: 100,
  address: 500,
  village: 100,
  landmark: 200,
  notes: 500,
}

export class RequestError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function sendJson(response, status, value) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(value))
}

function requireMethod(request, method) {
  if (request.method !== method) throw new RequestError(405, 'Method not allowed.')
}

function cleanText(value, maxLength, field) {
  if (typeof value !== 'string') throw new RequestError(400, `Please provide ${field}.`)
  const cleaned = value.trim()
  if (cleaned.length > maxLength) throw new RequestError(400, `${field} is too long.`)
  return cleaned
}

export function buildOrder(body, paymentMethod) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new RequestError(400, 'Invalid order details.')
  const sourceCustomer = body.customer
  if (!sourceCustomer || typeof sourceCustomer !== 'object') throw new RequestError(400, 'Please provide customer details.')

  const customer = Object.fromEntries(Object.entries(textFields).map(([field, limit]) => [
    field,
    cleanText(sourceCustomer[field] || (['landmark', 'notes'].includes(field) ? '' : undefined), limit, field),
  ]))
  for (const field of ['name', 'address', 'village']) {
    if (!customer[field]) throw new RequestError(400, `Please provide ${field}.`)
  }
  const phoneInput = cleanText(sourceCustomer.phone, 24, 'mobile number')
  const phoneDigits = phoneInput.replace(/\D/g, '')
  const phone = phoneDigits.length === 12 && phoneDigits.startsWith('91') ? phoneDigits.slice(2) : phoneDigits
  if (!/^[6-9]\d{9}$/.test(phone)) throw new RequestError(400, 'Please enter a valid 10-digit mobile number.')
  customer.phone = phone

  if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > products.length) {
    throw new RequestError(400, 'Choose at least one valid flower variety.')
  }
  const seen = new Set()
  const items = body.items.map((entry) => {
    if (!entry || typeof entry !== 'object' || !productById.has(entry.id) || seen.has(entry.id)) {
      throw new RequestError(400, 'The selected flower variety is not available.')
    }
    if (!Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > maxQuantityPerProduct) {
      throw new RequestError(400, 'Quantity must be a whole number from 1 to 100 kg per variety.')
    }
    seen.add(entry.id)
    const product = productById.get(entry.id)
    return {
      id: product.id,
      name: product.name,
      quantity: entry.quantity,
      unit: product.unit,
      pricePerUnit: product.pricePerUnit,
      subtotal: product.pricePerUnit * entry.quantity,
    }
  })
  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  if (!Number.isSafeInteger(total) || total < 1) throw new RequestError(400, 'The order total is invalid.')

  return {
    orderId: `MF-${new Date().getFullYear()}-${randomBytes(12).toString('hex').toUpperCase()}`,
    customer,
    items,
    subtotal: total,
    total,
    paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'pending_confirmation',
  }
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new RequestError(503, 'Order saving is not configured yet. Please contact Manohar Reddy directly.')
  return { url: url.replace(/\/$/, ''), key }
}

async function supabaseRequest(path, options = {}) {
  const { url, key } = getSupabaseConfig()
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    console.error('Supabase order request failed:', response.status, data?.code || 'unknown')
    throw new RequestError(503, 'We could not save your order. Please try again or contact Manohar Reddy.')
  }
  return data
}

function databaseRow(order) {
  return {
    id: order.orderId,
    customer_name: order.customer.name,
    phone: order.customer.phone,
    address: order.customer.address,
    village: order.customer.village,
    landmark: order.customer.landmark,
    notes: order.customer.notes,
    items: order.items.map((item) => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price_per_unit: item.pricePerUnit,
      subtotal: item.subtotal,
    })),
    subtotal_amount: order.subtotal,
    total_amount: order.total,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    order_status: order.orderStatus,
    gateway_order_id: order.gatewayOrderId || null,
  }
}

export async function insertOrder(order) {
  const rows = await supabaseRequest('orders', {
    method: 'POST',
    body: JSON.stringify(databaseRow(order)),
  })
  return publicOrder(rows[0])
}

export async function getOrder(orderId) {
  const rows = await supabaseRequest(`orders?id=eq.${encodeURIComponent(orderId)}&select=*`, { method: 'GET' })
  return rows[0] || null
}

export async function getOrderByGatewayId(gatewayOrderId) {
  const rows = await supabaseRequest(`orders?gateway_order_id=eq.${encodeURIComponent(gatewayOrderId)}&select=*`, { method: 'GET' })
  return rows[0] || null
}

export async function updateOrder(orderId, updates, filters = '') {
  const query = `orders?id=eq.${encodeURIComponent(orderId)}${filters}&select=*`
  const rows = await supabaseRequest(query, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
  return rows[0] || null
}

export function publicOrder(row) {
  return {
    orderId: row.id,
    customer: {
      name: row.customer_name,
      phone: row.phone,
      address: row.address,
      village: row.village,
      landmark: row.landmark || '',
      notes: row.notes || '',
    },
    items: row.items.map((item) => ({
      id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      pricePerUnit: item.price_per_unit,
      subtotal: item.subtotal,
    })),
    subtotal: row.subtotal_amount,
    total: row.total_amount,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    createdAt: row.created_at,
  }
}

export function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const mode = process.env.PAYMENT_MODE || 'test'
  if (!['test', 'live'].includes(mode) || !keyId || !keySecret) {
    throw new RequestError(503, 'Online payment is not configured yet. Choose Pay at Farm or contact Manohar Reddy.')
  }
  if (mode === 'live' && (process.env.VERCEL_ENV !== 'production' || !keyId.startsWith('rzp_live_'))) {
    throw new RequestError(503, 'Online payment is not enabled for this environment.')
  }
  if (mode === 'test' && keyId.startsWith('rzp_live_')) {
    throw new RequestError(503, 'Payment mode configuration does not match the gateway key.')
  }
  return { client: new Razorpay({ key_id: keyId, key_secret: keySecret }), keyId, keySecret }
}

export function validSignature(expected, actual) {
  if (typeof actual !== 'string' || !/^[a-f0-9]{64}$/i.test(actual)) return false
  const expectedBuffer = Buffer.from(expected, 'hex')
  const actualBuffer = Buffer.from(actual, 'hex')
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer)
}

export function errorResponse(response, error) {
  if (error instanceof RequestError) {
    sendJson(response, error.status, { error: error.message })
    return
  }
  console.error('Order API failed:', error?.message || 'unknown error')
  sendJson(response, 500, { error: 'Something went wrong. Please try again or contact Manohar Reddy.' })
}

export { createHmac, requireMethod }