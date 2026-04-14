CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Autonomous','Non-Autonomous')),
  rating DECIMAL(3,1),
  placement_score INTEGER,
  website VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS college_branches (
  id SERIAL PRIMARY KEY,
  college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,
  branch VARCHAR(100) NOT NULL,
  cutoff_open DECIMAL(5,2),
  cutoff_obc DECIMAL(5,2),
  cutoff_sc DECIMAL(5,2),
  cutoff_nt DECIMAL(5,2),
  cutoff_vjnt DECIMAL(5,2),
  year INTEGER DEFAULT 2024
);
CREATE INDEX IF NOT EXISTS idx_branches_college ON college_branches(college_id);
CREATE INDEX IF NOT EXISTS idx_branches_cutoff ON college_branches(cutoff_open);
