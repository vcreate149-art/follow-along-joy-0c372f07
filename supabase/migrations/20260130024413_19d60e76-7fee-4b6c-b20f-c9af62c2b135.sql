-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('student', 'teacher', 'staff', 'admin');

-- Create enum for payment status
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

-- Create enum for document request status
CREATE TYPE public.document_status AS ENUM ('pending', 'processing', 'ready', 'delivered');

-- Create profiles table for extended user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  address TEXT,
  id_number TEXT,
  user_type user_type NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table (master list of courses)
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disciplines table (subjects within courses)
CREATE TABLE public.disciplines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 0,
  semester INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student enrollments
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  progress_percent INTEGER DEFAULT 0,
  expected_completion DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- Create study materials
CREATE TABLE public.study_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline_id UUID REFERENCES public.disciplines(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessments/exams calendar
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discipline_id UUID REFERENCES public.disciplines(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_grade DECIMAL(5,2) DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student grades
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE NOT NULL,
  grade DECIMAL(5,2),
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, assessment_id)
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  reference_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create document requests
CREATE TABLE public.document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL,
  purpose TEXT,
  status document_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ready_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create announcements/notices
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT DEFAULT 'all',
  is_urgent BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert profiles" ON public.profiles
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Courses policies (public read, admin write)
CREATE POLICY "Anyone can view active courses" ON public.courses
FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage courses" ON public.courses
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Disciplines policies
CREATE POLICY "Anyone can view disciplines" ON public.disciplines
FOR SELECT USING (true);

CREATE POLICY "Admins can manage disciplines" ON public.disciplines
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Enrollments policies
CREATE POLICY "Students can view own enrollments" ON public.enrollments
FOR SELECT USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage enrollments" ON public.enrollments
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Study materials policies
CREATE POLICY "Enrolled students can view materials" ON public.study_materials
FOR SELECT USING (
  discipline_id IN (
    SELECT d.id FROM public.disciplines d
    JOIN public.enrollments e ON e.course_id = d.course_id
    JOIN public.profiles p ON p.id = e.student_id
    WHERE p.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage materials" ON public.study_materials
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Assessments policies
CREATE POLICY "Enrolled students can view assessments" ON public.assessments
FOR SELECT USING (
  discipline_id IN (
    SELECT d.id FROM public.disciplines d
    JOIN public.enrollments e ON e.course_id = d.course_id
    JOIN public.profiles p ON p.id = e.student_id
    WHERE p.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage assessments" ON public.assessments
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Grades policies
CREATE POLICY "Students can view own grades" ON public.grades
FOR SELECT USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage grades" ON public.grades
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Payments policies
CREATE POLICY "Students can view own payments" ON public.payments
FOR SELECT USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can manage payments" ON public.payments
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Document requests policies
CREATE POLICY "Students can view own requests" ON public.document_requests
FOR SELECT USING (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Students can create requests" ON public.document_requests
FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage requests" ON public.document_requests
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Announcements policies
CREATE POLICY "Anyone can view announcements" ON public.announcements
FOR SELECT USING (true);

CREATE POLICY "Admins can manage announcements" ON public.announcements
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample courses
INSERT INTO public.courses (name, description, duration, category) VALUES
('Contabilidade e Gestão', 'Curso técnico médio em contabilidade e gestão empresarial', '3 anos', 'Cursos Médios'),
('Secretariado Executivo', 'Formação profissional em secretariado e administração', '3 anos', 'Cursos Médios'),
('Informática', 'Curso técnico em sistemas de informação e suporte', '3 anos', 'Cursos Médios'),
('Marketing Digital', 'Curso curto de especialização em marketing online', '6 meses', 'Cursos Curtos'),
('Eletricidade Industrial', 'Formação técnica em instalações elétricas', '3 anos', 'Cursos Médios'),
('Recursos Humanos', 'Gestão de pessoas e desenvolvimento organizacional', '6 meses', 'Cursos Curtos'),
('Logística e Transporte', 'Gestão de cadeia de suprimentos e logística', '6 meses', 'Cursos Curtos');