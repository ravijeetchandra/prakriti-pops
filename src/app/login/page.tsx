'use client'

import Link from 'next/link'
import { FiUser, FiShield } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { useLang } from '@/lib/locale'

export default function LoginSelectionPage() {
  const { t } = useLang()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Welcome Back!
          </h1>
          <p className="text-muted text-lg">Please choose your account type to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* User Login Option */}
          <Link href="/login/user" className="group">
            <Card className="h-full p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border-2 border-transparent group-hover:border-primary/20">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <FiUser size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-3">User Login</h2>
              <p className="text-muted mb-8">
                Access your account, track your orders, and manage your profile.
              </p>
              <div className="mt-auto w-full py-3 rounded-xl bg-primary text-white font-semibold group-hover:bg-primary-dark transition-colors">
                Login as User
              </div>
            </Card>
          </Link>

          {/* Admin Login Option */}
          <Link href="/admin/login" className="group">
            <Card className="h-full p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border-2 border-transparent group-hover:border-secondary/20">
              <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                <FiShield size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Admin Login</h2>
              <p className="text-muted mb-8">
                Manage products, orders, coupons, and site announcements.
              </p>
              <div className="mt-auto w-full py-3 rounded-xl bg-secondary text-white font-semibold group-hover:bg-secondary-dark transition-colors">
                Login as Admin
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}