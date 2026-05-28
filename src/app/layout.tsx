import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import LayoutWrapper from "@/app/layout-wrapper"
import { SpeedInsights } from '@vercel/speed-insights/next'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Prakriti Pops — Bihar Ka Crunchy Revolution",
  description: "Mithila ki mitti se, ab GenZ swag ke saath. 100% natural makhana, roasted to perfection.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-foreground">
        <Providers>
          <LayoutWrapper>
            <main className="flex-1">{children}</main>
          </LayoutWrapper>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}