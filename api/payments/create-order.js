import { buildOrder, errorResponse, getRazorpay, insertOrder, requireMethod, sendJson } from '../_lib/orders.js'

export default async function handler(request, response) {
  try {
    requireMethod(request, 'POST')
    const order = buildOrder(request.body, 'razorpay')
    const { client, keyId } = getRazorpay()
    const gatewayOrder = await client.orders.create({
      amount: order.total * 100,
      currency: 'INR',
      receipt: order.orderId,
      notes: { order_id: order.orderId },
    })
    order.gatewayOrderId = gatewayOrder.id
    const saved = await insertOrder(order)
    sendJson(response, 201, {
      keyId,
      order: {
        orderId: saved.orderId,
        gatewayOrderId: gatewayOrder.id,
        amount: gatewayOrder.amount,
        currency: gatewayOrder.currency,
      },
    })
  } catch (error) {
    errorResponse(response, error)
  }
}