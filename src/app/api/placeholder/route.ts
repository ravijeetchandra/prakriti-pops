import { NextRequest, NextResponse } from 'next/server'

const productImageMap: Record<string, string> = {
  'peri peri': 'makhana-1.jpg',
  'peri-peri': 'makhana-1.jpg',
  peri: 'makhana-1.jpg',
  'masala makhana': 'makhana-2.jpg',
  masala: 'makhana-2.jpg',
  'salt & pepper': 'makhana-6.jpg',
  pepp: 'makhana-6.jpg',
  'classic salted': 'makhana-6.jpg',
  salted: 'makhana-6.jpg',
  'chocolate coated': 'makhana-3.jpg',
  chocolate: 'makhana-3.jpg',
  'magic masala': 'makhana-4.jpg',
  'tandoori makhana': 'makhana-5.jpg',
  tandoori: 'makhana-5.jpg',
  'mango makhana': 'makhana-4.jpg',
  mango: 'makhana-4.jpg',
  'chilli makhana': 'makhana-5.jpg',
  chilli: 'makhana-5.jpg',
  'coconut makhana': 'makhana-3.jpg',
  coconut: 'makhana-3.jpg',
  'herb makhana': 'makhana-6.jpg',
  herb: 'makhana-6.jpg',
  'garlic makhana': 'makhana-4.jpg',
  garlic: 'makhana-4.jpg',
}

const imageFiles = [
  'makhana-1.jpg', 'makhana-2.jpg', 'makhana-3.jpg',
  'makhana-4.jpg', 'makhana-5.jpg', 'makhana-6.jpg',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'Makhana'
  const nameLower = name.toLowerCase()

  const matchedKey = Object.keys(productImageMap).find((key) => nameLower.includes(key))
  const imageFile = matchedKey
    ? productImageMap[matchedKey]
    : imageFiles[[...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % imageFiles.length]

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="100%" stop-color="#F2EBE3"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#C49A3F"/>
      <stop offset="100%" stop-color="#D4A373"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)" rx="24"/>
  <circle cx="200" cy="160" r="80" fill="url(#accent)" opacity="0.12"/>
  <circle cx="200" cy="160" r="55" fill="url(#accent)" opacity="0.18"/>
  <text x="200" y="180" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="48" font-weight="bold" fill="#C49A3F">🍿</text>
  <text x="200" y="280" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" font-size="18" font-weight="600" fill="#5C4033">${escapeXml(name)}</text>
  <rect x="140" y="300" width="120" height="2" rx="1" fill="#C49A3F" opacity="0.4"/>
  <text x="200" y="340" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" font-size="11" font-weight="400" fill="#8C7E74">Prakriti Pops</text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
