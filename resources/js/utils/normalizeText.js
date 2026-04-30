export function normalizeText(text) {
  if (!text) return ''  
  const str = text.replace(/_/g, ' ').trim().toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1)
}
