import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import payAtFarm from './api/orders/pay-at-farm.js'
import createPaymentOrder from './api/payments/create-order.js'
import verifyPayment from './api/payments/verify.js'
import failPayment from './api/payments/fail.js'
import paymentWebhook from './api/payments/webhook.js'

const apiHandlers = new Map([
	['/api/orders/pay-at-farm', payAtFarm],
	['/api/payments/create-order', createPaymentOrder],
	['/api/payments/verify', verifyPayment],
	['/api/payments/fail', failPayment],
	['/api/payments/webhook', paymentWebhook],
])

function localApiPlugin() {
	return {
		name: 'marigold-local-api',
		configureServer(server) {
			server.middlewares.use(async (request, response, next) => {
				const pathname = new URL(request.url, 'http://localhost').pathname
				const handler = apiHandlers.get(pathname)
				if (!handler) return next()

				try {
					const chunks = []
					let size = 0
					for await (const chunk of request) {
						size += chunk.length
						if (size > 1024 * 1024) {
							response.statusCode = 413
							response.end(JSON.stringify({ error: 'Request is too large.' }))
							return
						}
						chunks.push(Buffer.from(chunk))
					}
					request.rawBody = Buffer.concat(chunks)
					if (request.headers['content-type']?.includes('application/json') && request.rawBody.length) {
						request.body = JSON.parse(request.rawBody.toString('utf8'))
					} else {
						request.body = {}
					}
					await handler(request, response)
				} catch {
					if (!response.headersSent) response.statusCode = 400
					if (!response.writableEnded) response.end(JSON.stringify({ error: 'Please check your order details and try again.' }))
				}
			})
		},
	}
}

export default defineConfig(({ mode }) => {
	Object.entries(loadEnv(mode, process.cwd(), '')).forEach(([key, value]) => {
		if (process.env[key] === undefined) process.env[key] = value
	})
	return { plugins: [react(), localApiPlugin()] }
})
