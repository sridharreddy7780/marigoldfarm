import {
  createHmac,
  errorResponse,
  getOrder,
  getRazorpay,
  publicOrder,
  requireMethod,
  sendJson,
  updateOrder,
  validSignature,
  RequestError,
} from '../_lib/orders.js'

async function markPaymentComplete(order, payment, gatewayOrderId) {
  if (payment.order_id !== gatewayOrderId || payment.amount !== order.total_amount * 100 || payment.currency !== 'INR' || payment.status !== 'captured') {
    throw new RequestError(400, 'Payment could not be verified. Please contact Manohar Reddy.')
  }
  if (order.payment_status === 'paid') {
    if (order.gateway_payment_id === payment.id) return order
    throw new RequestError(409, 'This order has already been paid.')
  }
  if (!['pending', 'failed'].includes(order.payment_status)) throw new RequestError(409, 'This order is no longer awaiting payment.')

  const updated = await updateOrder(order.id, {
    payment_status: 'paid',
    order_status: 'confirmed',
    gateway_payment_id: payment.id,
  }, '&payment_status=in.(pending,failed)')
  if (updated) return updated

  const latest = await getOrder(order.id)
  if (latest?.payment_status === 'paid' && latest.gateway_payment_id === payment.id) return latest
  throw new RequestError(409, 'This order could not be confirmed. Please contact Manohar Reddy.')
}

export { markPaymentComplete }

export default async function handler(request, response) {
  try {
    requireMethod(request, 'POST')
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = request.body || {}
    if (![orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature].every((value) => typeof value === 'string' && value.length < 200)) {
      throw new RequestError(400, 'Payment details are incomplete.')
    }
    const order = await getOrder(orderId)
    if (!order || order.payment_method !== 'razorpay' || order.gateway_order_id !== razorpayOrderId) {
      throw new RequestError(404, 'The payment order could not be found.')
    }
    const { client, keySecret } = getRazorpay()
    const signature = createHmac('sha256', keySecret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex')
    if (!validSignature(signature, razorpaySignature)) throw new RequestError(400, 'Payment could not be verified. Please try again.')

    const payment = await client.payments.fetch(razorpayPaymentId)
    const paidOrder = await markPaymentComplete(order, payment, razorpayOrderId)
    sendJson(response, 200, { order: publicOrder(paidOrder) })
  } catch (error) {
    errorResponse(response, error)
  }
}