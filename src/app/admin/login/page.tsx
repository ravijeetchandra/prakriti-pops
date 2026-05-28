'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toaster'
import { FiLock, FiShield } from 'react-icons/fi'
import { useAuthStore } from '@/store/authStore'

export default function AdminLoginPage() {
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

    const normalizedEmail = email.toLowerCase().trim()

    try {
      // Verify that the email exists in admin_users table
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .ilike('email', normalizedEmail)
        .single()

      if (userError || !adminUser) {
        throw new Error('Invalid admin credentials')
      }

      // Authenticate via Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({ 
        email: normalizedEmail, 
        password 
      })
      
      if (authError) throw authError
      
      // Set session cookie for AdminLayout check
      document.cookie = 'pp-admin-session=true; path=/; max-age=86400'
      
      // Update global auth state
      setIsAuthenticated(true)
      
      addToast('Welcome Admin! 🧠', 'success')
      router.push('/admin/dashboard')
    } catch (error: any) {
      addToast(error.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-8">
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold">{t('admin.login_title')}</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input label="Email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" fullWidth disabled={loading}>
            <FiLock size={16} className="mr-2" />
            {loading ? t('common.loading') : t('admin.login_btn')}
          </Button>
        </form>
      </Card>
    </div>
  )
}