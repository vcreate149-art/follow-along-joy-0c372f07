-- Create app_role enum for admin functionality
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for user_roles (only admins can view/manage)
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

-- Create inscricoes table for enrollment submissions
CREATE TABLE public.inscricoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    bilhete_identidade TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT,
    morada TEXT NOT NULL,
    escolaridade TEXT NOT NULL,
    tipo_curso TEXT NOT NULL,
    curso_escolhido TEXT NOT NULL,
    observacoes TEXT,
    status TEXT NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on inscricoes
ALTER TABLE public.inscricoes ENABLE ROW LEVEL SECURITY;

-- Policy for inscricoes (public insert, admin select)
CREATE POLICY "Anyone can submit inscricao"
ON public.inscricoes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view all inscricoes"
ON public.inscricoes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inscricoes"
ON public.inscricoes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT NOT NULL DEFAULT 'IMPNAT',
    category TEXT NOT NULL DEFAULT 'Notícias',
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for blog_posts (public read published, admin all)
CREATE POLICY "Anyone can read published posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create vocational_test_results table
CREATE TABLE public.vocational_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    answers JSONB NOT NULL,
    recommended_courses JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vocational_test_results
ALTER TABLE public.vocational_test_results ENABLE ROW LEVEL SECURITY;

-- Policy for vocational_test_results (public insert)
CREATE POLICY "Anyone can submit test results"
ON public.vocational_test_results
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view test results"
ON public.vocational_test_results
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create chat_conversations table for AI chatbot
CREATE TABLE public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    messages JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_conversations
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Policy for chat_conversations (anyone can create/update their session)
CREATE POLICY "Anyone can create chat"
ON public.chat_conversations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read their chat"
ON public.chat_conversations
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can update their chat"
ON public.chat_conversations
FOR UPDATE
TO anon, authenticated
USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_inscricoes_updated_at
BEFORE UPDATE ON public.inscricoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, published) VALUES
('Inscrições Abertas para 2026', 'inscricoes-abertas-2026', 'Garante já a tua vaga nos cursos profissionais do IMPNAT. Inscrição 100% gratuita!', 'O Instituto Médio Politécnico NAT abre as inscrições para o ano letivo de 2026. Com mais de 10 anos de experiência na formação profissional, oferecemos cursos certificados pela ANEP com estágio garantido. A inscrição é completamente gratuita e pode ser feita online ou presencialmente.', 'Inscrições', true),
('Cerimónia de Graduação 2025', 'cerimonia-graduacao-2025', 'Celebramos mais uma turma de formados que entram no mercado de trabalho.', 'Foi com grande orgulho que celebramos a formatura da turma de 2025. Mais de 200 estudantes receberam os seus diplomas em diversas áreas como Contabilidade, Eletricidade Industrial, Informática e muito mais. Parabéns a todos os graduados!', 'Eventos', true),
('Parceria com Empresas Locais', 'parceria-empresas-locais', 'Novas parcerias garantem estágios profissionais para os nossos estudantes.', 'O IMPNAT estabeleceu novas parcerias com empresas de renome em Moçambique para garantir oportunidades de estágio e emprego para os nossos formandos. Empresas como EDM, Vodacom e BCI fazem parte do nosso programa de inserção profissional.', 'Parcerias', true);