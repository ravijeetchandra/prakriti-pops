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
import { FiMail, FiLock } from 'react-icons/fi'

export default function LoginPage() {
  const { t } = useLang()
  const router = useRouter()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!isSupabaseConfigured) {
      addToast('⚠️ Connect Supabase first. Use /admin/login for now.', 'error')
      setLoading(false)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      addToast(error.message, 'error')
    } else {
      addToast('Logged in! 🎉', 'success')
      router.push('/my-account')
      router.refresh()
    }
    setLoading(false)
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
