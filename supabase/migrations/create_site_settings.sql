-- Migration: Create site_settings table
-- Run this in your Supabase SQL editor if the table doesn't exist

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  site_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  cod_enabled BOOLEAN DEFAULT true,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  free_delivery_threshold DECIMAL(10,2) DEFAULT 499,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default row if not exists
INSERT INTO site_settings (id, site_name, contact_email, contact_phone)
VALUES ('singleton', 'Prakriti Pops', 'hello@prakritipops.com', '+91 98765 43210')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Public can read site settings') THEN
    CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Admins can manage site settings') THEN
    CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL TO authenticated USING (
      EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
    );
  END IF;
END $$;
