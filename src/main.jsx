import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<CartProvider>
				<App />
				<Analytics />
			</CartProvider>
		</BrowserRouter>
	</React.StrictMode>,
)
