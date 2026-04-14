CREATE TABLE IF NOT EXISTS cap_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  percentile DECIMAL(5,2) NOT NULL,
  category VARCHAR(20) NOT NULL,
  branches TEXT[],
  location VARCHAR(100),
  college_type VARCHAR(50),
  result_data JSONB NOT NULL,
  ai_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cap_user ON cap_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_cap_created ON cap_lists(created_at DESC);
