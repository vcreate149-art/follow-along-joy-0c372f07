-- Create table for authorized emails (only these can register)
CREATE TABLE public.authorized_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  student_id text, -- Optional student ID/number
  course_id uuid REFERENCES public.courses(id),
  authorized_by uuid REFERENCES public.profiles(id),
  authorized_at timestamp with time zone DEFAULT now(),
  registered_at timestamp with time zone, -- When they actually created account
  notes text
);

-- Enable RLS
ALTER TABLE public.authorized_emails ENABLE ROW LEVEL SECURITY;

-- Policies: Only admins can manage, but anyone can check if email exists during registration
CREATE POLICY "Admins can manage authorized emails"
ON public.authorized_emails
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Anyone can check email authorization"
ON public.authorized_emails
FOR SELECT
TO anon, authenticated
USING (true);

-- Create index for fast email lookups
CREATE INDEX idx_authorized_emails_email ON public.authorized_emails(email);