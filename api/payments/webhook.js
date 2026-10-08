import {
  createHmac,
  errorResponse,
  getOrderByGatewayId,
  getRazorpay,
  RequestError,
  sendJson,
  validSignature,
} from '../_lib/orders.js'
import { markPaymentComplete } from './verify.js'

export const config = { api: { bodyParser: false } }

async function rawRequestBody(request) {
  if (Buffer.isBuffer(request.rawBody)) return request.rawBody
  const chunks = []
  for await (const chunk of request) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks)
}

export default async function handler(request, response) {
  try {
    if (request.method !== 'POST') throw new RequestError(405, 'Method not allowed.')
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) throw new RequestError(503, 'Payment webhook is not configured.')
    const rawBody = await rawRequestBody(request)
    const signature = request.headers['x-razorpay-signature']
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
    if (!validSignature(expected, signature)) throw new RequestError(400, 'Invalid webhook signature.')

    const event = JSON.parse(rawBody.toString('utf8'))
    if (event.event === 'payment.captured') {
      const webhookPayment = event.payload?.payment?.entity
      if (!webhookPayment?.id || !webhookPayment?.order_id) throw new RequestError(400, 'Invalid payment event.')
      const order = await getOrderByGatewayId(webhookPayment.order_id)
      if (!order) throw new RequestError(404, 'Payment order not found.')
      const { client } = getRazorpay()
      const payment = await client.payments.fetch(webhookPayment.id)
      await markPaymentComplete(order, payment, webhookPayment.order_id)
    }
    sendJson(response, 200, { received: true })
  } catch (error) {
    errorResponse(response, error)
  }
}