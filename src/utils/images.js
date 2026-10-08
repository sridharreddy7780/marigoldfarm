// Photos are picked up automatically from src/assets/images by file name:
// farmer, yellow-banti, orange-banti, flower-field, marigold-sacks, bathukamma
// (.jpg / .jpeg / .png / .webp). Pass an array to Photo to try several names in order.
const files = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
const byName = {}
Object.entries(files).forEach(([k, v]) => { byName[k.split('/').pop().replace(/\.\w+$/, '').toLowerCase()] = v })
export const getImage = (names) => {
  for (const n of [].concat(names)) if (byName[n]) return byName[n]
  return null
}
