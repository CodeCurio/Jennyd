-- Create table for Independent Business Owner (IBO) Registrations
CREATE TABLE IF NOT EXISTS public.ibo_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 1. Personal Information
  full_name TEXT NOT NULL,
  mother_name TEXT,
  father_name TEXT,
  dob DATE,
  gender TEXT, -- 'Male', 'Female', 'Other'
  occupation TEXT,
  marital_status TEXT, -- 'Single', 'Married', 'Other'

  -- 2. Identity & Government Verification
  pan_tax_number TEXT,
  aadhaar_national_id TEXT,
  other_gov_id TEXT,
  driving_license TEXT,
  passport_number TEXT,
  national_id_number TEXT,
  voter_card_number TEXT,

  -- 3. Contact Information
  mobile_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT NOT NULL,
  alternate_contact TEXT,

  -- 4. Residential Address
  house_flat_no TEXT,
  street TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  district TEXT,
  state TEXT,
  pin_code TEXT,
  country TEXT DEFAULT 'India',
  same_as_permanent BOOLEAN DEFAULT true,

  -- Permanent Address (if different from residential)
  perm_house_flat_no TEXT,
  perm_street TEXT,
  perm_landmark TEXT,
  perm_city TEXT,
  perm_district TEXT,
  perm_state TEXT,
  perm_pin_code TEXT,
  perm_country TEXT DEFAULT 'India',

  -- 5. Sponsor / Referral Information
  sponsor_name TEXT,
  sponsor_ibo_id TEXT,
  sponsor_mobile TEXT,

  -- 6. Bank & Payment Details
  account_holder_name TEXT, -- As Per PAN Card
  bank_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  upi_id TEXT,

  -- 7. Business Information
  hear_about_us TEXT[] DEFAULT '{}', -- ['Mentor', 'Social Media', 'Website', 'Referral', 'Exhibition', 'Other']
  hear_about_other TEXT,

  -- 8. Declaration & Consent
  consent_agreement BOOLEAN DEFAULT false,
  consent_income_disclosure BOOLEAN DEFAULT false,

  -- 9. Purchase Order Verification
  purchase_order_no TEXT NOT NULL,

  -- Administrative tracking
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Contacted', 'Approved', 'Rejected'
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ibo_registrations ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at trigger
CREATE OR REPLACE TRIGGER update_ibo_registrations_updated_at 
  BEFORE UPDATE ON public.ibo_registrations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Policies
-- 1. Anyone (public/authenticated) can insert an IBO registration
CREATE POLICY "Public insert ibo_registrations" 
  ON public.ibo_registrations 
  FOR INSERT 
  WITH CHECK (true);

-- 2. Admins can view, update and delete all IBO registrations
CREATE POLICY "Admin all ibo_registrations" 
  ON public.ibo_registrations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Indexes for fast querying & search in admin panel
CREATE INDEX IF NOT EXISTS idx_ibo_registrations_created_at ON public.ibo_registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ibo_registrations_status ON public.ibo_registrations (status);
CREATE INDEX IF NOT EXISTS idx_ibo_registrations_purchase_order ON public.ibo_registrations (purchase_order_no);
CREATE INDEX IF NOT EXISTS idx_ibo_registrations_pan ON public.ibo_registrations (pan_tax_number);
CREATE INDEX IF NOT EXISTS idx_ibo_registrations_mobile ON public.ibo_registrations (mobile_number);

-- ============================================================================
-- Create table for General Partner Inquiries (Join & Grow Partner Applications)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  partner_type TEXT NOT NULL DEFAULT 'Retail Store / Boutique Owner',
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at trigger
CREATE OR REPLACE TRIGGER update_partner_applications_updated_at 
  BEFORE UPDATE ON public.partner_applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Policies
CREATE POLICY "Public insert partner_applications" 
  ON public.partner_applications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admin all partner_applications" 
  ON public.partner_applications 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_partner_applications_created_at ON public.partner_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_applications_status ON public.partner_applications (status);
CREATE INDEX IF NOT EXISTS idx_partner_applications_phone ON public.partner_applications (phone);

