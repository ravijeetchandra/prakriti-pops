'use client'

import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { Campaign, Product } from './types'

export interface ActiveCampaign extends Campaign {
  productSet: Set<string>
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<ActiveCampaign[]>([])

  useEffect(() => {
    ;(async () => {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true)
        .lte('start_time', now)
        .gte('end_time', now)
      if (data) {
        setCampaigns(
          (data as Campaign[]).map((c) => ({ ...c, productSet: new Set(c.product_ids) }))
        )
      }
    })()
  }, [])

  return campaigns
}

export function getProductCampaign(
  productId: string,
  campaigns: ActiveCampaign[]
): ActiveCampaign | null {
  if (!campaigns.length) return null
  let best: ActiveCampaign | null = null
  for (const c of campaigns) {
    if (c.productSet.has(productId)) {
      if (!best || c.discount_percent > best.discount_percent) {
        best = c
      }
    }
  }
  return best
}

export function getCampaignPrice(product: Product | { id: string; price: number }, campaign: ActiveCampaign | null) {
  if (!campaign) return { discounted: false, price: product.price, campaignPrice: product.price, savings: 0, percent: 0, title: '' }
  const discounted = product.price * (1 - campaign.discount_percent / 100)
  return {
    discounted: true,
    price: discounted,
    campaignPrice: discounted,
    savings: product.price - discounted,
    percent: campaign.discount_percent,
    title: campaign.title_en,
  }
}
