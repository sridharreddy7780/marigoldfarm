export const pendingKey = 'marigold-farm-pending-checkout'
export const resultKey = 'marigold-farm-last-order'

export function orderItems(order) {
  return order.items.map((item) => `${item.name}: ${item.quantity} ${item.unit}`).join('\n')
}