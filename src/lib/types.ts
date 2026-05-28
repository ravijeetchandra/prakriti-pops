export interface Product {
  id: string
  name_en: string
  name_hi: string
  slug: string
  description_en: string
  description_hi: string
  price: number
  compare_price: number | null
  category: string
  flavor: string
  stock_qty: number
  images: string[]
  is_active: boolean
  is_featured: boolean
  created_at: string
}

export interface CartItem {
  product_id: string
  name_en: string
  name_hi: string
  slug: string
  price: number
  qty: number
  image: string
  original_price?: number
  campaign_id?: string | null
}

export interface Order {
  id: string
  order_id: string
  session_id: string | null
  user_id: string | null
  customer_name: string
  customer_phone: string
  email: string | null
  customer_address: string
  pincode: string
  notes: string | null
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  payment_method: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  coupon_code: string | null
  campaign_discount: number
  campaign_id: string | null
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_cart_value: number
  max_uses: number
  used_count: number
  is_active: boolean
  expires_at: string
  created_at: string
}

export interface Announcement {
  id: string
  text_en: string
  text_hi: string
  is_active: boolean
  bg_color: string
  text_color: string
  created_at: string
  expires_at: string | null
}

export interface Campaign {
  id: string
  title_en: string
  title_hi: string
  type: 'flash_sale' | 'bundle'
  discount_percent: number
  start_time: string
  end_time: string
  is_active: boolean
  product_ids: string[]
  created_at: string
}

export interface OrderTimeline {
  id: string
  order_id: string
  status: string
  note: string | null
  updated_by: string
  created_at: string
}
