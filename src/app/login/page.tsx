'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toaster'
import Link from 'next/link'
import { FiLock } from 'react-icons/fi'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const { t } = useLang()
  const router = useRouter()
  const { addToast } = useToast()
  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!isSupabaseConfigured) {
      addToast('⚠️ Connect Supabase first.', 'error')
      setLoading(false)
      return
    }

    const normalizedEmail = email.toLowerCase().trim()

    try {
      // 1. Authenticate the user via Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: normalizedEmail, 
        password 
      })

      if (authError) throw authError

      // 2. Check if the user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .ilike('email', normalizedEmail)
        .single()

      if (adminUser) {
        // Admin User Flow
        document.cookie = 'pp-admin-session=true; path=/; max-age=86400'
        setIsAuthenticated(true)
        addToast('Welcome Admin! 🧠', 'success')
        router.push('/admin/dashboard')
        return
      }

      // Customer User Flow
      addToast('Welcome back! 🎉', 'success')
      router.push('/my-account')
    } catch (error: any) {
      addToast(error.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <Card className="p-8">
        <h1 className="text-2xl font-extrabold text-center text-foreground mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth disabled={loading}>
            <FiLock size={16} className="mr-2" />
            {loading ? t('common.loading') : 'Login'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted mt-6">
          No account?{' '}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  )
}