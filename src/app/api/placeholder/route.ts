import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

  const imagePath = path.join(process.cwd(), 'public', 'images', imageFile)

  try {
    const buffer = fs.readFileSync(imagePath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.redirect(new URL(`/images/${imageFile}`, request.url))
  }
}
