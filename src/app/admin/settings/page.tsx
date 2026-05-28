'use client'

import { useState, useEffect } from 'react'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toaster'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminSettingsPage() {
  const { t } = useLang()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    site_name: 'Prakriti Pops',
    contact_email: 'hello@prakritipops.com',
    contact_phone: '+91 98765 43210',
    cod_enabled: true,
    delivery_charge: '0',
    free_delivery_threshold: '499',
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
          throw error
        }

        if (data) {
          setSettings({
            site_name: data.site_name,
            contact_email: data.contact_email,
            contact_phone: data.contact_phone,
            cod_enabled: data.cod_enabled,
            delivery_charge: data.delivery_charge.toString(),
            free_delivery_threshold: data.free_delivery_threshold.toString(),
          })
        }
      } catch (err) {
        console.error('Error loading settings:', err)
        addToast('Failed to load settings', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [addToast])

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'singleton',
          site_name: settings.site_name,
          contact_email: settings.contact_email,
          contact_phone: settings.contact_phone,
          cod_enabled: settings.cod_enabled,
          delivery_charge: parseFloat(settings.delivery_charge) || 0,
          free_delivery_threshold: parseFloat(settings.free_delivery_threshold) || 0,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      addToast('Settings saved to database!', 'success')
    } catch (err) {
      console.error('Error saving settings:', err)
      addToast('Failed to save settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner text="Loading settings..." />

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold">⚙️ Settings</h1>

      <Card className="p-6 space-y-4">
        <h2 className="font-bold text-lg">Store Settings</h2>
        <Input label="Site Name" value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} />
        <Input label="Contact Email" type="email" value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} />
        <Input label="Contact Phone" value={settings.contact_phone} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} />
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-bold text-lg">Delivery Settings</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={settings.cod_enabled} onChange={(e) => setSettings({ ...settings, cod_enabled: e.target.checked })} />
          Enable Cash on Delivery
        </label>
        <Input label="Delivery Charge (₹)" type="number" value={settings.delivery_charge} onChange={(e) => setSettings({ ...settings, delivery_charge: e.target.value })} />
        <Input label="Free Delivery Above (₹)" type="number" value={settings.free_delivery_threshold} onChange={(e) => setSettings({ ...settings, free_delivery_threshold: e.target.value })} />
      </Card>

      <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : t('admin.save')}</Button>
    </div>
  )
}
