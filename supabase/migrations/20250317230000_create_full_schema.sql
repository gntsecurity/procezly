-- Create users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'auditor', 'viewer')) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    industry TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- Create user-company relationship table
CREATE TABLE public.user_company (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'auditor', 'viewer')) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Create audits table
CREATE TABLE public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP DEFAULT now()
);

-- Create audit findings table
CREATE TABLE public.audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
    status TEXT CHECK (status IN ('open', 'resolved')) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Create audit reports table
CREATE TABLE public.audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    generated_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.users(id),
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) NOT NULL,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now()
);

-- Create system logs table
CREATE TABLE public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    performed_by UUID REFERENCES public.users(id),
    timestamp TIMESTAMP DEFAULT now()
);
