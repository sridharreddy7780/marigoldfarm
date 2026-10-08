import { errorResponse, getOrder, RequestError, requireMethod, sendJson, updateOrder } from '../_lib/orders.js'

export default async function handler(request, response) {
  try {
    requireMethod(request, 'POST')
    const { orderId, reason } = request.body || {}
    if (typeof orderId !== 'string' || !['failed', 'cancelled'].includes(reason)) throw new RequestError(400, 'Invalid payment status request.')
    const order = await getOrder(orderId)
    if (!order || order.payment_method !== 'razorpay') throw new RequestError(404, 'The order could not be found.')
    if (order.payment_status === 'paid') throw new RequestError(409, 'This order has already been paid.')
    if (order.payment_status === 'pending') {
      await updateOrder(order.id, {
        payment_status: 'failed',
        order_status: 'cancelled',
      }, '&payment_status=eq.pending')
    }
    sendJson(response, 200, { ok: true })
  } catch (error) {
    errorResponse(response, error)
  }
}