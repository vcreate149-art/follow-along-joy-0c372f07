-- First migration: just add the enum values
-- The functions will be created in a separate migration after this commits

-- Note: The enum values were already added in the failed migration attempt
-- Now we create the functions

-- Create a function to check admin hierarchy level (higher number = more permissions)
CREATE OR REPLACE FUNCTION public.get_admin_level(_role app_role)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT CASE _role::text
    WHEN 'director_geral' THEN 4
    WHEN 'sub_director' THEN 3
    WHEN 'chefe_departamento' THEN 2
    WHEN 'assistente' THEN 1
    WHEN 'admin' THEN 4
    ELSE 0
  END
$$;

-- Create function to check if user is any type of admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin', 'director_geral', 'sub_director', 'chefe_departamento', 'assistente')
  )
$$;

-- Create function to get user's highest admin level
CREATE OR REPLACE FUNCTION public.get_user_admin_level(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(MAX(public.get_admin_level(role)), 0)
  FROM public.user_roles
  WHERE user_id = _user_id
$$;