'use client'

import type { Product } from '@/lib/types'
import type { ActiveCampaign } from '@/lib/campaigns'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  campaigns?: ActiveCampaign[]
}

export default function ProductGrid({ products, campaigns = [] }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🥲</p>
        <p className="text-lg text-muted">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} campaigns={campaigns} />
      ))}
    </div>
  )
}
