-- Seed coupons table with standard codes
INSERT INTO coupons (code, type, value, min_order_amount, is_active)
VALUES 
  ('WELCOME10', 'percentage', 10, 500, true),
  ('FLAT500', 'fixed', 500, 2000, true)
ON CONFLICT (code) DO NOTHING;

-- Reload cache
NOTIFY pgrst, 'reload schema';
