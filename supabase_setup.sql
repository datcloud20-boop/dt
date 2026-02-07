-- ==========================================================
-- DAT CLOUDE | MASTER DATABASE ARCHITECTURE (A TO Z)
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS TABLE
-- Stores all portfolio items with detailed metadata
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  media_url TEXT,
  tools TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Published',
  price NUMERIC DEFAULT 0,
  client TEXT,
  live_url TEXT,
  github_url TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. MESSAGES TABLE
-- Stores contact form transmissions
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  content TEXT,
  date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SITE CONFIGURATION TABLE
-- Controls global UI, Hero section, and branding
CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  logo_text TEXT DEFAULT 'DAT CLOUDE',
  logo_image_url TEXT,
  logo_position TEXT DEFAULT 'left',
  logo_x NUMERIC DEFAULT 0,
  logo_y NUMERIC DEFAULT 0,
  footer_description TEXT DEFAULT 'A high-end portfolio and service-based e-commerce platform for creative professionals.',
  hero_title TEXT DEFAULT 'DESIGNING THE FUTURE OF DIGITAL EXPERIENCES.',
  hero_subtitle TEXT DEFAULT 'We turn bold ideas into high-converting solutions.',
  hero_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  hero_video_url TEXT,
  hero_video_opacity INTEGER DEFAULT 100,
  hero_text_color TEXT DEFAULT '#ffffff',
  hero_text_position TEXT DEFAULT 'left',
  hero_title_size NUMERIC DEFAULT 6.8,
  hero_image_size NUMERIC DEFAULT 90,
  hero_image_x NUMERIC DEFAULT 0,
  hero_image_y NUMERIC DEFAULT 0,
  stats JSONB DEFAULT '{"projects": 120, "clients": 45, "years": 8}',
  socials JSONB DEFAULT '{"instagram": "#", "twitter": "#", "linkedin": "#", "youtube": "#", "facebook": "#", "discord": "#"}',
  tools JSONB DEFAULT '[]',
  contact_email TEXT DEFAULT 'datcloud20@gmail.com',
  whatsapp_number TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT one_row CHECK (id = 1)
);

-- 5. USER PROFILES TABLE
-- Extends the internal auth.users table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. INITIAL SEED DATA
-- Ensures the settings page has data to load initially
INSERT INTO site_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- Crucial for connecting 100% securely
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 8. SECURITY POLICIES (RLS)

-- Projects Policies
CREATE POLICY "Anyone can view published projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin full access to projects" ON projects FOR ALL TO authenticated 
  USING (auth.jwt() ->> 'email' = 'datcloud20@gmail.com');

-- Messages Policies
CREATE POLICY "Public can send messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view/delete messages" ON messages FOR ALL TO authenticated 
  USING (auth.jwt() ->> 'email' = 'datcloud20@gmail.com');

-- Site Config Policies
CREATE POLICY "Public can view site config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Admin can update site config" ON site_config FOR UPDATE TO authenticated 
  USING (auth.jwt() ->> 'email' = 'datcloud20@gmail.com');

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 9. AUTOMATED TRIGGERS

-- Create profile on signup automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    NEW.email,
    CASE WHEN NEW.email = 'datcloud20@gmail.com' THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_config_timestamp BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ==========================================================
-- EMERGENCY AUTH FIX (IF LOGIN FAILS)
-- ==========================================================
-- 1. Register your email in the web app's /signup page first.
-- 2. Run the command below to force-verify your account if the email confirmation is stuck:

-- UPDATE auth.users SET email_confirmed_at = now() WHERE email = 'datcloud20@gmail.com';
