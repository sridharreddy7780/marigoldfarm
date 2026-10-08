import { buildOrder, errorResponse, insertOrder, requireMethod, sendJson } from '../_lib/orders.js'

export default async function handler(request, response) {
  try {
    requireMethod(request, 'POST')
    const order = buildOrder(request.body, 'pay_at_farm')
    const saved = await insertOrder(order)
    sendJson(response, 201, { order: saved })
  } catch (error) {
    errorResponse(response, error)
  }
}