-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE product_status AS ENUM ('draft', 'active');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE fulfillment_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');

-- 1. profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. site_settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'My Store',
  tagline TEXT,
  logo_url TEXT,
  logo_inverted_url TEXT,
  favicon_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  business_address TEXT,
  currency_code TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$',
  tax_rate NUMERIC DEFAULT 0,
  tax_inclusive BOOLEAN DEFAULT false,
  announcement_bar_active BOOLEAN DEFAULT false,
  announcement_bar_text TEXT,
  announcement_bar_link TEXT,
  announcement_bar_color TEXT DEFAULT '#000000',
  social_instagram TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  social_tiktok TEXT,
  social_youtube TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. seo_settings
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title_template TEXT DEFAULT '{Page Title} | {Site Name}',
  default_meta_description TEXT,
  og_default_image_url TEXT,
  ga_tracking_id TEXT,
  fb_pixel_id TEXT,
  search_console_meta TEXT,
  robots_txt TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. page_seo
CREATE TABLE page_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT
);

-- 5. categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  sale_start TIMESTAMPTZ,
  sale_end TIMESTAMPTZ,
  sku TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  allow_backorders BOOLEAN DEFAULT false,
  status product_status DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. product_images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  alt_text TEXT
);

-- 8. product_options
CREATE TABLE product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 9. product_option_values
CREATE TABLE product_option_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID REFERENCES product_options(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 10. product_variants
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT,
  price NUMERIC,
  stock_quantity INTEGER DEFAULT 0,
  option_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. addresses
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  shipping_method TEXT,
  shipping_cost NUMERIC DEFAULT 0,
  subtotal NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  coupon_code TEXT,
  payment_status payment_status DEFAULT 'pending',
  fulfillment_status fulfillment_status DEFAULT 'pending',
  razorpay_payment_id TEXT,
  tracking_number TEXT,
  tracking_carrier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  variant_info JSONB,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  line_total NUMERIC NOT NULL
);

-- 14. order_timeline
CREATE TABLE order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status fulfillment_status NOT NULL,
  note TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. coupons
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type coupon_type NOT NULL,
  value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  usage_limit INTEGER,
  per_customer_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  applicable_products UUID[],
  applicable_categories UUID[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. hero_slides
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  heading TEXT,
  subheading TEXT,
  cta_text TEXT,
  cta_link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 19. wishlist
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 20. media
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || to_char(NOW(), 'YYMMDDHH24MISS') || '-' || floor(random() * 10000)::text;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON orders FOR EACH ROW WHEN (NEW.order_number IS NULL) EXECUTE FUNCTION generate_order_number();

-- Decrement stock on order creation
CREATE OR REPLACE FUNCTION process_order_item()
RETURNS TRIGGER AS $$
DECLARE
  v_track_inventory BOOLEAN;
BEGIN
  SELECT track_inventory INTO v_track_inventory FROM products WHERE id = NEW.product_id;
  IF v_track_inventory THEN
    UPDATE products SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.product_id;
    IF NEW.variant_id IS NOT NULL THEN
      UPDATE product_variants SET stock_quantity = stock_quantity - NEW.quantity WHERE id = NEW.variant_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER process_order_item_trigger AFTER INSERT ON order_items FOR EACH ROW EXECUTE FUNCTION process_order_item();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());

CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL USING (is_admin());

CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Admin write seo_settings" ON seo_settings FOR ALL USING (is_admin());

CREATE POLICY "Public read page_seo" ON page_seo FOR SELECT USING (true);
CREATE POLICY "Admin write page_seo" ON page_seo FOR ALL USING (is_admin());

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON categories FOR ALL USING (is_admin());

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON products FOR ALL USING (is_admin());

CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admin write product_images" ON product_images FOR ALL USING (is_admin());

CREATE POLICY "Public read product_options" ON product_options FOR SELECT USING (true);
CREATE POLICY "Admin write product_options" ON product_options FOR ALL USING (is_admin());

CREATE POLICY "Public read product_option_values" ON product_option_values FOR SELECT USING (true);
CREATE POLICY "Admin write product_option_values" ON product_option_values FOR ALL USING (is_admin());

CREATE POLICY "Public read product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Admin write product_variants" ON product_variants FOR ALL USING (is_admin());

CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Admin write hero_slides" ON hero_slides FOR ALL USING (is_admin());

CREATE POLICY "Public read media" ON media FOR SELECT USING (true);
CREATE POLICY "Admin write media" ON media FOR ALL USING (is_admin());

CREATE POLICY "Users CRUD own addresses" ON addresses FOR ALL USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users insert orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Admin update orders" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete orders" ON orders FOR DELETE USING (is_admin());

CREATE POLICY "Users read own order_items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Users insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update order_items" ON order_items FOR UPDATE USING (is_admin());
CREATE POLICY "Admin delete order_items" ON order_items FOR DELETE USING (is_admin());

CREATE POLICY "Users read own order_timeline" ON order_timeline FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_timeline.order_id AND (orders.user_id = auth.uid() OR is_admin()))
);
CREATE POLICY "Admin all order_timeline" ON order_timeline FOR ALL USING (is_admin());

CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin all reviews" ON reviews FOR ALL USING (is_admin());

CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Admin all coupons" ON coupons FOR ALL USING (is_admin());

CREATE POLICY "Public insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin all subscribers" ON subscribers FOR ALL USING (is_admin());

CREATE POLICY "Users CRUD own wishlist" ON wishlist FOR ALL USING (auth.uid() = user_id OR is_admin());
