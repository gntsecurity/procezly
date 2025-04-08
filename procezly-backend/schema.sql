-- organizations
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- org_users
CREATE TABLE org_users (
  user_id TEXT,
  organization_id TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  display_name TEXT,
  PRIMARY KEY (user_id, organization_id)
);

-- kamishibai_cards
CREATE TABLE kamishibai_cards (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  uid TEXT NOT NULL,
  area TEXT NOT NULL,
  task TEXT,
  responsible TEXT,
  modified_by TEXT,
  modified TEXT,
  tips TEXT,
  supporting_documents TEXT,
  non_conformance TEXT,
  safety_concerns TEXT,
  audit_phase TEXT DEFAULT 'Planned',
  owner TEXT
);

-- audit_schedule_settings
CREATE TABLE audit_schedule_settings (
  organization_id TEXT PRIMARY KEY,
  frequency TEXT NOT NULL DEFAULT 'weekly',
  day_of_week TEXT,
  time_of_day TEXT NOT NULL DEFAULT '08:00',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- smtp_settings
CREATE TABLE smtp_settings (
  organization_id TEXT PRIMARY KEY,
  smtp_host TEXT,
  smtp_port INTEGER,
  smtp_user TEXT,
  smtp_pass TEXT
);

-- audit_logs
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  user_id TEXT,
  action TEXT NOT NULL,
  context TEXT,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);
