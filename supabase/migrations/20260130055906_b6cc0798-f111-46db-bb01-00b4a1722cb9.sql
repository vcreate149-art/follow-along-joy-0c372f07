-- Add new admin hierarchy levels to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'director_geral';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sub_director';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'chefe_departamento';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'assistente';