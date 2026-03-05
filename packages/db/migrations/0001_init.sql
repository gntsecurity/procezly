create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  status text not null default 'pending',
  verified_domain text null,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  azure_sub text not null,
  email text not null,
  display_name text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, azure_sub),
  unique (tenant_id, email)
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, name)
);

create table if not exists user_roles (
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  primary key (tenant_id, user_id, role_id)
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid null,
  actor_user_id uuid null,
  action text not null,
  entity_type text null,
  entity_id text null,
  old_value jsonb null,
  new_value jsonb null,
  ip text null,
  user_agent text null,
  created_at timestamptz not null default now()
);

create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  code text null,
  created_at timestamptz not null default now()
);

create table if not exists processes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  plant_id uuid not null references plants(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists kamishibai_cards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  process_id uuid not null references processes(id) on delete cascade,
  title text not null,
  description text not null,
  risk_level int not null default 3,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists kamishibai_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  process_id uuid not null references processes(id) on delete cascade,
  layer int not null,
  frequency_per_week int not null,
  created_at timestamptz not null default now()
);

create table if not exists kamishibai_audits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  plan_id uuid not null references kamishibai_plans(id) on delete cascade,
  scheduled_for date not null,
  completed_at timestamptz null,
  completed_by uuid null references users(id),
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table if not exists kamishibai_audit_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  audit_id uuid not null references kamishibai_audits(id) on delete cascade,
  card_id uuid not null references kamishibai_cards(id) on delete cascade,
  result text null,
  notes text null,
  evidence_key text null,
  created_at timestamptz not null default now()
);
