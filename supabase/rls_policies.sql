-- Enable RLS for all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 1. Products: Public can read, only admins can write
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON products FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 2. Orders: Users can read/create their own, Admins can manage all
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (
  auth.uid() = user_id OR LOWER(email) = LOWER(auth.jwt() ->> 'email')
);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all orders" ON orders FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 3. Order Timeline: Admin can manage, Owner can read
CREATE POLICY "Users can view their order timeline" ON order_timeline FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_timeline.order_id 
    AND (orders.user_id = auth.uid() OR LOWER(orders.email) = LOWER(auth.jwt() ->> 'email'))
  )
);
CREATE POLICY "Admins can manage order timeline" ON order_timeline FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 4. User Profiles: Owner can read/write, Admin can read
CREATE POLICY "Users can manage their own profile" ON user_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins can view user profiles" ON user_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 5. User Addresses: Owner can manage, Admin can read
CREATE POLICY "Users can manage their own addresses" ON user_addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view user addresses" ON user_addresses FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 6. Wishlists: Owner can manage, Admin can read
CREATE POLICY "Users can manage their own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view wishlists" ON wishlists FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 7. Coupons: Public read, Admin manage
CREATE POLICY "Public can view coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 8. Announcements: Public read, Admin manage
CREATE POLICY "Public can view announcements" ON announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 9. Campaigns: Public read, Admin manage
CREATE POLICY "Public can view campaigns" ON campaigns FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage campaigns" ON campaigns FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 10. Admin Users: Owners can view their own, Admins can manage all
CREATE POLICY "Admins can view their own admin profile" ON admin_users FOR SELECT TO authenticated USING (
  LOWER(email) = LOWER(auth.jwt() ->> 'email')
);
CREATE POLICY "Admins can manage admin users" ON admin_users FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);

-- 11. Site Settings: Public read, Admin manage
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email'))
);
