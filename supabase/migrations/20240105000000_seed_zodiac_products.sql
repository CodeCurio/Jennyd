DO $$ 
DECLARE 
  zodiac_cat_id UUID := gen_random_uuid();
  signature_cat_id UUID := gen_random_uuid();
  p_id UUID;
BEGIN
  -- Insert Categories
  INSERT INTO categories (id, name, slug, description) VALUES
    (zodiac_cat_id, 'Zodiac Collection', 'zodiac-collection', 'Discover your perfect scent based on your zodiac sign.'),
    (signature_cat_id, 'Signature Collection', 'signature-collection', 'Our exclusive signature scents.');

  -- Aries
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Aries', 'aries', 'The bold and fiery scent for Aries.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-ARI-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/aries.jpeg', 0, 'Aries Fragrance');

  -- Taurus
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Taurus', 'taurus', 'The grounded and sensual scent for Taurus.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-TAU-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/taurus.jpeg', 0, 'Taurus Fragrance');

  -- Gemini
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Gemini', 'gemini', 'The dynamic and airy scent for Gemini.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-GEM-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/gemini.jpeg', 0, 'Gemini Fragrance');

  -- Cancer
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Cancer', 'cancer', 'The nurturing and aquatic scent for Cancer.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-CAN-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/cancer.jpeg', 0, 'Cancer Fragrance');

  -- Leo
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Leo', 'leo', 'The radiant and majestic scent for Leo.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-LEO-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/leo.jpeg', 0, 'Leo Fragrance');

  -- Virgo
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Virgo', 'virgo', 'The pure and earthy scent for Virgo.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-VIR-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/virgo.jpeg', 0, 'Virgo Fragrance');

  -- Libra
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Libra', 'libra', 'The harmonious and elegant scent for Libra.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-LIB-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/libra.jpeg', 0, 'Libra Fragrance');

  -- Scorpio
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Scorpio', 'scorpio', 'The intense and mysterious scent for Scorpio.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-SCO-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/scorpio.jpeg', 0, 'Scorpio Fragrance');

  -- Sagittarius
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Sagittarius', 'sagittarius', 'The adventurous and spirited scent for Sagittarius.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-SAG-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/sagittarius.jpeg', 0, 'Sagittarius Fragrance');

  -- Capricorn
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Capricorn', 'capricorn', 'The timeless and ambitious scent for Capricorn.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-CAP-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/capricorn.jpeg', 0, 'Capricorn Fragrance');

  -- Aquarius
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Aquarius', 'aquarius', 'The unique and visionary scent for Aquarius.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-AQU-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/aquarius.jpeg', 0, 'Aquarius Fragrance');

  -- Pisces
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Pisces', 'pisces', 'The dreamy and intuitive scent for Pisces.', zodiac_cat_id, 49.99, 'active', 100, 'ZOD-PIS-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/zodiacs/pisces.jpeg', 0, 'Pisces Fragrance');

  -- Product Image 1
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Signature Bloom', 'signature-bloom', 'Our beautiful signature bloom fragrance.', signature_cat_id, 69.99, 'active', 50, 'SIG-BLM-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/product image 1.jpeg', 0, 'Signature Bloom Fragrance');

  -- Product Image 2
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Midnight Velvet', 'midnight-velvet', 'A deep and sophisticated evening scent.', signature_cat_id, 79.99, 'active', 50, 'SIG-VEL-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/product image 2.jpeg', 0, 'Midnight Velvet Fragrance');

  -- Product Image 3
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Ocean Breeze', 'ocean-breeze', 'Fresh and invigorating maritime notes.', signature_cat_id, 59.99, 'active', 50, 'SIG-OCN-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/product image 3.jpeg', 0, 'Ocean Breeze Fragrance');

  -- Product Image 4
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Amber Glow', 'amber-glow', 'Warm amber and vanilla undertones.', signature_cat_id, 89.99, 'active', 50, 'SIG-AMB-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/product image 4.jpeg', 0, 'Amber Glow Fragrance');

  -- Product Image 5
  p_id := gen_random_uuid();
  INSERT INTO products (id, title, slug, description, category_id, price, status, stock_quantity, sku)
  VALUES (p_id, 'Citrus Spark', 'citrus-spark', 'Bright and zesty citrus blend.', signature_cat_id, 64.99, 'active', 50, 'SIG-CIT-01');
  INSERT INTO product_images (product_id, image_url, sort_order, alt_text) VALUES (p_id, '/assets/product image 5.jpeg', 0, 'Citrus Spark Fragrance');

END $$;
