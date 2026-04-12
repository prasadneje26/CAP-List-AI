-- ============================================================
-- AI COLLEGE CAP COUNSELING PLATFORM
-- File: database/schema.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
    firebase_uid VARCHAR(128),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE 2: students
-- ============================================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    percentile NUMERIC(5,2) NOT NULL CHECK (percentile >= 0 AND percentile <= 100),
    exam_type VARCHAR(10) NOT NULL CHECK (exam_type IN ('CET', 'JEE')),
    category VARCHAR(20) NOT NULL CHECK (category IN ('OPEN', 'OBC', 'SC', 'ST', 'EWS', 'TFWS', 'PWD')),
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    home_university VARCHAR(100),
    branch_preferences TEXT[],
    location_preferences TEXT[],
    college_type VARCHAR(20) CHECK (college_type IN ('Government', 'Aided', 'Unaided', 'Autonomous', 'Any')),
    budget_max INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE 3: colleges
-- ============================================================
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(100),
    district VARCHAR(100),
    university VARCHAR(150),
    college_type VARCHAR(20),
    rating NUMERIC(3,1),
    placement_score NUMERIC(4,1),
    annual_fees INTEGER,
    total_seats INTEGER,
    is_autonomous BOOLEAN DEFAULT FALSE,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE 4: cutoffs (historical per branch per category)
-- ============================================================
CREATE TABLE cutoffs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    branch VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    exam_type VARCHAR(10) NOT NULL,
    year INTEGER NOT NULL,
    round_number INTEGER DEFAULT 1,
    cutoff_percentile NUMERIC(5,2),
    seats_available INTEGER,
    UNIQUE(college_id, branch, category, exam_type, year, round_number)
);

-- ============================================================
-- TABLE 5: predictions
-- ============================================================
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id),
    branch VARCHAR(100) NOT NULL,
    predicted_cutoff NUMERIC(5,2),
    admission_probability NUMERIC(5,2),
    classification VARCHAR(10) CHECK (classification IN ('Dream', 'Target', 'Safe')),
    ranking_score NUMERIC(6,3),
    cap_order INTEGER,
    predicted_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE 6: prediction_logs (audit trail)
-- ============================================================
CREATE TABLE prediction_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    input_data JSONB,
    output_data JSONB,
    model_version VARCHAR(20),
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE 7: feedback
-- ============================================================
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    message TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE 8: mentorship
-- ============================================================
CREATE TABLE mentorship (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES users(id),
    session_date TIMESTAMP,
    duration_minutes INTEGER DEFAULT 30,
    topic VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    meeting_link VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_cutoffs_college_year ON cutoffs(college_id, year);
CREATE INDEX idx_predictions_student ON predictions(student_id);
CREATE INDEX idx_prediction_logs_student ON prediction_logs(student_id);
CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_mentorship_student ON mentorship(student_id);
CREATE INDEX idx_mentorship_mentor ON mentorship(mentor_id);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();