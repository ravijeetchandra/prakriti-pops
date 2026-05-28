'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Check Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        
        // 2. Check for admin session cookie (as fallback/extra check)
        const cookies = document.cookie.split(';')
        const adminSessionCookie = cookies.find(cookie => cookie.trim().startsWith('pp-admin-session='))
        const hasAdminCookie = adminSessionCookie?.split('=')[1] === 'true'

        if (session && hasAdminCookie) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  return { isAuthenticated, isLoading }
}