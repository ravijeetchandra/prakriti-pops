export function generateOrderId(index: number): string {
  return `PP-${1000 + index}`
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusLabel(status: string, lang: 'en' | 'hi'): string {
  const labels: Record<string, { en: string; hi: string }> = {
    pending: { en: 'Pending', hi: 'लंबित' },
    confirmed: { en: 'Confirmed', hi: 'पुष्टि हुई' },
    shipped: { en: 'Shipped', hi: 'भेज दिया गया' },
    delivered: { en: 'Delivered', hi: 'डिलीवर हो गया' },
    cancelled: { en: 'Cancelled', hi: 'रद्द कर दिया' },
  }
  return labels[status]?.[lang] || status
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
