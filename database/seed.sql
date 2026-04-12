-- ============================================================
-- AI COLLEGE CAP COUNSELING PLATFORM
-- File: database/seed.sql
-- ============================================================

-- ============================================================
-- SEED: colleges
-- ============================================================
INSERT INTO colleges (id, name, code, location, district, university, college_type, rating, placement_score, annual_fees, total_seats, is_autonomous) VALUES
('a1b2c3d4-0001-0001-0001-000000000001', 'College of Engineering Pune', 'COEP', 'Pune', 'Pune', 'Savitribai Phule Pune University', 'Government', 9.2, 88.5, 85000, 480, TRUE),
('a1b2c3d4-0002-0002-0002-000000000002', 'Vishwakarma Institute of Technology', 'VIT', 'Pune', 'Pune', 'Savitribai Phule Pune University', 'Unaided', 8.8, 85.0, 145000, 720, TRUE),
('a1b2c3d4-0003-0003-0003-000000000003', 'Pune Institute of Computer Technology', 'PICT', 'Pune', 'Pune', 'Savitribai Phule Pune University', 'Unaided', 8.7, 84.0, 120000, 480, TRUE),
('a1b2c3d4-0004-0004-0004-000000000004', 'Pimpri Chinchwad College of Engineering', 'PCCOE', 'Pune', 'Pune', 'Savitribai Phule Pune University', 'Unaided', 8.5, 82.0, 110000, 720, FALSE),
('a1b2c3d4-0005-0005-0005-000000000005', 'Maharashtra Institute of Technology', 'MIT', 'Pune', 'Pune', 'Savitribai Phule Pune University', 'Unaided', 8.3, 80.0, 130000, 600, TRUE),
('a1b2c3d4-0006-0006-0006-000000000006', 'Government College of Engineering Aurangabad', 'GCEA', 'Aurangabad', 'Aurangabad', 'Dr. Babasaheb Ambedkar Marathwada University', 'Government', 8.0, 75.0, 75000, 360, FALSE),
('a1b2c3d4-0007-0007-0007-000000000007', 'Walchand College of Engineering', 'WCE', 'Sangli', 'Sangli', 'Shivaji University', 'Government', 8.4, 78.0, 80000, 480, FALSE),
('a1b2c3d4-0008-0008-0008-000000000008', 'Sardar Patel College of Engineering', 'SPCE', 'Mumbai', 'Mumbai', 'University of Mumbai', 'Aided', 8.1, 79.0, 95000, 420, FALSE),
('a1b2c3d4-0009-0009-0009-000000000009', 'Veermata Jijabai Technological Institute', 'VJTI', 'Mumbai', 'Mumbai', 'University of Mumbai', 'Government', 9.0, 87.0, 90000, 540, TRUE),
('a1b2c3d4-0010-0010-0010-000000000010', 'Institute of Chemical Technology', 'ICT', 'Mumbai', 'Mumbai', 'University of Mumbai', 'Government', 8.9, 86.0, 88000, 360, TRUE);

-- ============================================================
-- SEED: cutoffs (2022–2025, OPEN category, CET, CS branch)
-- ============================================================
INSERT INTO cutoffs (college_id, branch, category, exam_type, year, round_number, cutoff_percentile, seats_available) VALUES
-- COEP CS
('a1b2c3d4-0001-0001-0001-000000000001', 'Computer Engineering', 'OPEN', 'CET', 2022, 1, 99.10, 60),
('a1b2c3d4-0001-0001-0001-000000000001', 'Computer Engineering', 'OPEN', 'CET', 2023, 1, 99.21, 60),
('a1b2c3d4-0001-0001-0001-000000000001', 'Computer Engineering', 'OPEN', 'CET', 2024, 1, 99.35, 60),
('a1b2c3d4-0001-0001-0001-000000000001', 'Computer Engineering', 'OPEN', 'CET', 2025, 1, 99.45, 60),
-- VIT CS
('a1b2c3d4-0002-0002-0002-000000000002', 'Computer Engineering', 'OPEN', 'CET', 2022, 1, 97.20, 120),
('a1b2c3d4-0002-0002-0002-000000000002', 'Computer Engineering', 'OPEN', 'CET', 2023, 1, 97.50, 120),
('a1b2c3d4-0002-0002-0002-000000000002', 'Computer Engineering', 'OPEN', 'CET', 2024, 1, 97.80, 120),
('a1b2c3d4-0002-0002-0002-000000000002', 'Computer Engineering', 'OPEN', 'CET', 2025, 1, 98.10, 120),
-- PICT CS
('a1b2c3d4-0003-0003-0003-000000000003', 'Computer Engineering', 'OPEN', 'CET', 2022, 1, 96.50, 120),
('a1b2c3d4-0003-0003-0003-000000000003', 'Computer Engineering', 'OPEN', 'CET', 2023, 1, 96.80, 120),
('a1b2c3d4-0003-0003-0003-000000000003', 'Computer Engineering', 'OPEN', 'CET', 2024, 1, 97.10, 120),
('a1b2c3d4-0003-0003-0003-000000000003', 'Computer Engineering', 'OPEN', 'CET', 2025, 1, 97.40, 120),
-- PCCOE CS
('a1b2c3d4-0004-0004-0004-000000000004', 'Computer Engineering', 'OPEN', 'CET', 2022, 1, 94.20, 120),
('a1b2c3d4-0004-0004-0004-000000000004', 'Computer Engineering', 'OPEN', 'CET', 2023, 1, 94.60, 120),
('a1b2c3d4-0004-0004-0004-000000000004', 'Computer Engineering', 'OPEN', 'CET', 2024, 1, 95.00, 120),
('a1b2c3d4-0004-0004-0004-000000000004', 'Computer Engineering', 'OPEN', 'CET', 2025, 1, 95.40, 120),
-- VJTI CS
('a1b2c3d4-0009-0009-0009-000000000009', 'Computer Engineering', 'OPEN', 'CET', 2022, 1, 98.50, 90),
('a1b2c3d4-0009-0009-0009-000000000009', 'Computer Engineering', 'OPEN', 'CET', 2023, 1, 98.70, 90),
('a1b2c3d4-0009-0009-0009-000000000009', 'Computer Engineering', 'OPEN', 'CET', 2024, 1, 98.90, 90),
('a1b2c3d4-0009-0009-0009-000000000009', 'Computer Engineering', 'OPEN', 'CET', 2025, 1, 99.05, 90),
-- OBC category examples (PCCOE CS)
('a1b2c3d4-0004-0004-0004-000000000004', 'Computer Engineering', 'OBC', 'CET', 2024, 1, 92.00, 36),
('a1b2c3d4-0004-0004-0004-000000000004', 'Computer Engineering', 'SC',  'CET', 2024, 1, 80.00, 24),
('a1b2c3d4-0004-0004-0004-000000000004', 'Computer Engineering', 'ST',  'CET', 2024, 1, 70.00, 12),
-- Mechanical branch (COEP)
('a1b2c3d4-0001-0001-0001-000000000001', 'Mechanical Engineering', 'OPEN', 'CET', 2024, 1, 96.00, 60),
('a1b2c3d4-0001-0001-0001-000000000001', 'Mechanical Engineering', 'OPEN', 'CET', 2025, 1, 96.40, 60),
-- IT branch (VIT)
('a1b2c3d4-0002-0002-0002-000000000002', 'Information Technology', 'OPEN', 'CET', 2024, 1, 96.50, 60),
('a1b2c3d4-0002-0002-0002-000000000002', 'Information Technology', 'OPEN', 'CET', 2025, 1, 96.90, 60),
-- E&TC branch (MIT)
('a1b2c3d4-0005-0005-0005-000000000005', 'Electronics & Telecommunication', 'OPEN', 'CET', 2024, 1, 91.00, 60),
('a1b2c3d4-0005-0005-0005-000000000005', 'Electronics & Telecommunication', 'OPEN', 'CET', 2025, 1, 91.50, 60);

-- ============================================================
-- SEED: sample admin user (password: Admin@1234)
-- bcrypt hash of "Admin@1234"
-- ============================================================
INSERT INTO users (id, name, email, password_hash, role, is_verified) VALUES
('00000000-0000-0000-0000-000000000001',
 'Platform Admin',
 'admin@capcounselor.in',
 '$2b$12$KIXBq6K5B5kWzVSzLz6FZeT9D6XqN7W4PbMrHkL3YcVAuZ1XqNmUO',
 'admin',
 TRUE);

-- ============================================================
-- SEED: sample mentor
-- ============================================================
INSERT INTO users (id, name, email, password_hash, role, is_verified) VALUES
('00000000-0000-0000-0000-000000000002',
 'Rahul Sharma',
 'mentor@capcounselor.in',
 '$2b$12$KIXBq6K5B5kWzVSzLz6FZeT9D6XqN7W4PbMrHkL3YcVAuZ1XqNmUO',
 'mentor',
 TRUE);