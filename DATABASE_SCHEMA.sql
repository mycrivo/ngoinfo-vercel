-- NGOInfo Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Plans table (pricing tiers)
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  proposals_per_month INTEGER NOT NULL,
  manual_review_included BOOLEAN NOT NULL DEFAULT false,
  trial_days INTEGER,
  stripe_price_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default plans
INSERT INTO plans (id, name, price, proposals_per_month, manual_review_included, trial_days, is_featured) VALUES
('trial', 'Trial', 0.00, 1, false, 2, false),
('starter', 'Starter', 19.00, 2, false, NULL, false),
('growth', 'Growth', 39.00, 5, true, NULL, true),
('impact_plus', 'Impact+', 79.00, 7, true, NULL, false)
ON CONFLICT (id) DO NOTHING;

-- User plan state (subscription tracking)
CREATE TABLE IF NOT EXISTS user_plan_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id),
  quota_used INTEGER NOT NULL DEFAULT 0,
  monthly_quota INTEGER NOT NULL,
  trial_expires_at TIMESTAMPTZ,
  subscription_status TEXT CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NGO Profiles (organization details)
CREATE TABLE IF NOT EXISTS ngo_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  country TEXT,
  region TEXT,
  sectors TEXT[],
  annual_budget_usd DECIMAL(12, 2),
  staff_count INTEGER,
  founded_year INTEGER,
  mission_statement TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Proposals (generated documents)
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id TEXT,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'final', 'submitted', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Usage logs (audit trail)
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('generate', 'regenerate', 'download', 'delete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_plan_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- user_plan_state policies
CREATE POLICY "Users can view their own plan state"
  ON user_plan_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own plan state"
  ON user_plan_state FOR UPDATE
  USING (auth.uid() = user_id);

-- ngo_profiles policies
CREATE POLICY "Users can view their own profile"
  ON ngo_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON ngo_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON ngo_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- proposals policies
CREATE POLICY "Users can view their own proposals"
  ON proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own proposals"
  ON proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proposals"
  ON proposals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proposals"
  ON proposals FOR DELETE
  USING (auth.uid() = user_id);

-- usage_logs policies
CREATE POLICY "Users can view their own usage logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Storage bucket for proposal exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_plan_state_user_id ON user_plan_state(user_id);
CREATE INDEX IF NOT EXISTS idx_ngo_profiles_user_id ON ngo_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_plan_state_updated_at
  BEFORE UPDATE ON user_plan_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ngo_profiles_updated_at
  BEFORE UPDATE ON ngo_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

