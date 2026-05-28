import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const imageFiles = [
  'makhana-1.jpg',
  'makhana-2.jpg',
  'makhana-3.jpg',
  'makhana-4.jpg',
  'makhana-5.jpg',
  'makhana-6.jpg',
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'Makhana'
  const index = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const imageFile = imageFiles[index % imageFiles.length]
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
    // Fallback: redirect to a known image
    return NextResponse.redirect(new URL(`/images/${imageFile}`, request.url))
  }
}
