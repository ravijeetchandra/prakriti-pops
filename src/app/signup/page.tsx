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
import { FiUserPlus } from 'react-icons/fi'

export default function SignupPage() {
  const { t } = useLang()
  const router = useRouter()
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!isSupabaseConfigured) {
      addToast('⚠️ Connect Supabase first. Use /admin/login for now.', 'error')
      setLoading(false)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      addToast(authError.message, 'error')
      setLoading(false)
      return
    }

    if (authData.user) {
      await supabase.from('user_profiles').insert({
        id: authData.user.id,
        name,
        phone,
      })
    }

    addToast('Account created! Check your email for verification.', 'success')
    router.push('/login')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <Card className="p-8">
        <h1 className="text-2xl font-extrabold text-center text-foreground mb-6">Sign Up</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <Input label="Full Name" placeholder="Rajesh Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Phone" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" fullWidth disabled={loading}>
            <FiUserPlus size={16} className="mr-2" />
            {loading ? t('common.loading') : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  )
}
