export const products = [
  {
    id: 'yellow-banti',
    name: 'Yellow Banti',
    teluguName: 'పసుపు బంతి',
    description: 'Fresh Yellow Marigolds',
    pricePerUnit: 100,
    unit: 'kg',
    image: 'yellow-banti',
  },
  {
    id: 'orange-banti',
    name: 'Orange Banti',
    teluguName: 'ఆరెంజ్ బంతి',
    description: 'Fresh Orange Marigolds',
    pricePerUnit: 100,
    unit: 'kg',
    image: 'orange-banti',
  },
]

export const productPriceNote = 'Current indicative price. Final price may vary based on market conditions.'
export const maxQuantityPerProduct = 100

export const formatPrice = (amount) => `₹${new Intl.NumberFormat('en-IN').format(amount)}`