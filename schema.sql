-- School Management System Database Schema - Enhanced Version
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== DROP EXISTING TABLES (IF ANY) ====================
DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS student_subjects CASCADE;
DROP TABLE IF EXISTS subject_teachers CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- ==================== USER ROLES TABLE (For Supabase Auth Integration) ====================
-- This table links Supabase Auth users to their roles and teacher records
CREATE TABLE user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE, -- References auth.users(id) in Supabase Auth
    role TEXT NOT NULL CHECK (role IN ('admin', 'teacher')),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE, -- NULL for admin users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_roles
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_teacher_id ON user_roles(teacher_id);

-- ==================== TEACHERS TABLE ====================
CREATE TABLE teachers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    name_with_initials TEXT NOT NULL,
    appointed_date DATE NOT NULL,
    teacher_grade TEXT CHECK (teacher_grade IN ('Grade 3', 'Grade 2', 'Grade 1')),
    subject_specialization TEXT,
    contact_number TEXT NOT NULL,
    emergency_contact_number TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for teachers
CREATE INDEX idx_teachers_name_initials ON teachers(name_with_initials);
CREATE INDEX idx_teachers_grade ON teachers(teacher_grade);

-- ==================== CLASSES TABLE ====================
CREATE TABLE classes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    grade INTEGER NOT NULL CHECK (grade >= 6 AND grade <= 11),
    class_letter TEXT NOT NULL CHECK (class_letter IN ('A', 'B', 'C')),
    class_name TEXT GENERATED ALWAYS AS ('Grade ' || grade || '-' || class_letter) STORED,
    class_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    vice_class_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    class_monitor_id UUID,  -- Will be set after student is created
    vice_class_monitor_id UUID,  -- Will be set after student is created
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(grade, class_letter)
);

-- Create indexes for classes
CREATE INDEX idx_classes_grade ON classes(grade);
CREATE INDEX idx_classes_teacher ON classes(class_teacher_id);

-- ==================== STUDENTS TABLE ====================
CREATE TABLE students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admission_no TEXT UNIQUE,
    full_name TEXT NOT NULL,
    name_with_initials TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    admission_date DATE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    
    -- Guardian Details - Father
    father_name TEXT,
    father_job TEXT,
    father_contact TEXT,
    
    -- Guardian Details - Mother
    mother_name TEXT,
    mother_job TEXT,
    mother_contact TEXT,
    
    -- Guardian Details - Guardian (if applicable)
    guardian_name TEXT,
    guardian_job TEXT,
    guardian_contact TEXT,
    guardian_relationship TEXT,
    
    -- Emergency Contact
    emergency_contact_name TEXT,
    emergency_contact_number TEXT,
    emergency_contact_relationship TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for students
CREATE INDEX idx_students_admission_no ON students(admission_no);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_name_initials ON students(name_with_initials);
CREATE INDEX idx_students_dob ON students(date_of_birth);

-- ==================== SUBJECTS TABLE ====================
CREATE TABLE subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject_code TEXT NOT NULL UNIQUE,
    subject_name TEXT NOT NULL,
    subject_type TEXT NOT NULL CHECK (subject_type IN (
        'Main Subject',
        'Basket Subject - General (Grade 6-9)',
        'Basket Subject - 1st Basket (Grade 10-11)',
        'Basket Subject - 2nd Basket (Grade 10-11)',
        'Basket Subject - 3rd Basket (Grade 10-11)'
    )),
    applicable_grades INTEGER[] NOT NULL,  -- Array of grades [6,7,8,9] or [10,11]
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for subjects
CREATE INDEX idx_subjects_code ON subjects(subject_code);
CREATE INDEX idx_subjects_type ON subjects(subject_type);

-- ==================== SUBJECT-TEACHER ASSIGNMENT (Many-to-Many) ====================
CREATE TABLE subject_teachers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    UNIQUE(subject_id, teacher_id)
);

CREATE INDEX idx_subject_teachers_subject ON subject_teachers(subject_id);
CREATE INDEX idx_subject_teachers_teacher ON subject_teachers(teacher_id);

-- ==================== STUDENT SUBJECT SELECTION (Basket Subjects) ====================
CREATE TABLE student_subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, academic_year)
);

CREATE INDEX idx_student_subjects_student ON student_subjects(student_id);
CREATE INDEX idx_student_subjects_subject ON student_subjects(subject_id);

-- ==================== ATTENDANCE TABLE ====================
CREATE TABLE attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status BOOLEAN NOT NULL DEFAULT FALSE,
    marked_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- Create indexes for attendance
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_marked_by ON attendance(marked_by);

-- ==================== MARKS TABLE ====================
CREATE TABLE marks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL CHECK (exam_name IN ('First Term', 'Second Term', 'Third Term')),
    exam_date DATE,
    marks INTEGER NOT NULL CHECK (marks >= 0 AND marks <= 100),
    grade TEXT,
    entered_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    approval_status TEXT NOT NULL DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Recheck Required')),
    approved_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    recheck_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for marks
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_subject_id ON marks(subject_id);
CREATE INDEX idx_marks_class_id ON marks(class_id);
CREATE INDEX idx_marks_exam_name ON marks(exam_name);
CREATE INDEX idx_marks_approval_status ON marks(approval_status);
CREATE INDEX idx_marks_entered_by ON marks(entered_by);

-- ==================== TIMETABLE TABLE ====================
CREATE TABLE timetable (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    day_of_week TEXT CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    is_break BOOLEAN DEFAULT FALSE,
    break_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create indexes for timetable
CREATE INDEX idx_timetable_class_id ON timetable(class_id);
CREATE INDEX idx_timetable_day ON timetable(day_of_week);
CREATE INDEX idx_timetable_subject ON timetable(subject_id);
CREATE INDEX idx_timetable_teacher ON timetable(teacher_id);

-- ==================== NOTIFICATIONS TABLE ====================
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('admin', 'teacher')),
    notification_type TEXT NOT NULL CHECK (notification_type IN ('marks_submitted', 'marks_approved', 'marks_recheck_required')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_marks_id UUID REFERENCES marks(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ==================== ADD FOREIGN KEY CONSTRAINTS FOR CLASS MONITORS ====================
ALTER TABLE classes
ADD CONSTRAINT fk_class_monitor FOREIGN KEY (class_monitor_id) REFERENCES students(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_vice_class_monitor FOREIGN KEY (vice_class_monitor_id) REFERENCES students(id) ON DELETE SET NULL;

-- ==================== INSERT DEFAULT SUBJECTS ====================

-- Main Subjects (Grade 6-11)
-- General Main Subjects (Grade 6-9)
INSERT INTO subjects (subject_code, subject_name, subject_type, applicable_grades) VALUES
('MTH69', 'Mathematics', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('SCI69', 'Science', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('SIN69', 'First Language: Sinhala', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('TAM69', 'First Language: Tamil', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('ENG69', 'English as a Second Language', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('HIS69', 'History', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('BUD69', 'Religion: Buddhism', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('ISL69', 'Religion: Islam', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('CAT69', 'Religion: Roman Catholicism', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('HIN69', 'Religion: Hinduism', 'Main Subject - General (Grade 6-9)', ARRAY[6,7,8,9]);

-- OL Main Subjects (Grade 10-11)
INSERT INTO subjects (subject_code, subject_name, subject_type, applicable_grades) VALUES
('MTH1011', 'Mathematics', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('SCI1011', 'Science', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('SIN1011', 'First Language: Sinhala', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('TAM1011', 'First Language: Tamil', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('ENG1011', 'English as a Second Language', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('HIS1011', 'History', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('BUD1011', 'Religion: Buddhism', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('ISL1011', 'Religion: Islam', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('CAT1011', 'Religion: Roman Catholicism', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]),
('HIN1011', 'Religion: Hinduism', 'Main Subject - OL (Grade 10-11)', ARRAY[10,11]);

-- General Other Subjects (Grade 6-9)
INSERT INTO subjects (subject_code, subject_name, subject_type, applicable_grades) VALUES
('ICT69', 'ICT', 'Other Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('HPE69', 'Health and Physical Education', 'Other Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('GEO69', 'Geography', 'Other Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('LCC69', 'Life Competencies and Citizenship Education', 'Other Subject - General (Grade 6-9)', ARRAY[6,7,8,9]);

-- Basket Subjects for Grade 6-9
INSERT INTO subjects (subject_code, subject_name, subject_type, applicable_grades) VALUES
('MUS69', 'Music', 'Basket Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('DAN69', 'Dancing', 'Basket Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('ART69', 'Art', 'Basket Subject - General (Grade 6-9)', ARRAY[6,7,8,9]),
('DRA69', 'Drama and Theatre', 'Basket Subject - General (Grade 6-9)', ARRAY[6,7,8,9]);

-- 1st Basket Subjects for Grade 10-11
INSERT INTO subjects (subject_code, subject_name, subject_type, applicable_grades) VALUES
('GEO', 'Geography', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]),
('CIV', 'Civic Education', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]),
('BAS', 'Business & Accounting Studies', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]),
('SIN2', 'Sinhala as a Second Language', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]),
('TAM2', 'Tamil as a Second Language', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]),
('FRE', 'French', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]),
('GER', 'German', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]),
('JAP', 'Japanese', 'Basket Subject - 1st Basket (Grade 10-11)', ARRAY[10,11]);

-- 2nd Basket Subjects for Grade 10-11
INSERT INTO subjects (subject_code, subject_name, subject_type, applicable_grades) VALUES
('WMUS', 'Western Music', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]),
('EMUS', 'Eastern Music', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]),
('ART', 'Art', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]),
('DRA', 'Drama and Theatre', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]),
('DAN', 'Dancing', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]),
('ELIT', 'Appreciation of English Literary Texts', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]),
('SLIT', 'Appreciation of Sinhala Literary Texts', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]),
('TLIT', 'Appreciation of Tamil Literary Texts', 'Basket Subject - 2nd Basket (Grade 10-11)', ARRAY[10,11]);

-- 3rd Basket Subjects for Grade 10-11
INSERT INTO subjects (subject_code, subject_name, subject_type, applicable_grades) VALUES
('ICT', 'ICT', 'Basket Subject - 3rd Basket (Grade 10-11)', ARRAY[10,11]),
('AFS', 'Agri and Food Science', 'Basket Subject - 3rd Basket (Grade 10-11)', ARRAY[10,11]),
('HPE', 'Health & Physical Education', 'Basket Subject - 3rd Basket (Grade 10-11)', ARRAY[10,11]),
('CMS', 'Communication & Media Studies', 'Basket Subject - 3rd Basket (Grade 10-11)', ARRAY[10,11]);

-- ==================== USEFUL VIEWS ====================

-- View for student brief information
CREATE OR REPLACE VIEW student_brief_view AS
SELECT 
    s.id,
    s.admission_no,
    s.name_with_initials,
    s.full_name,
    c.class_name,
    c.grade,
    c.class_letter,
    EXTRACT(YEAR FROM s.date_of_birth) AS birth_year,
    t.name_with_initials AS class_teacher_name,
    t.id AS class_teacher_id,
    s.date_of_birth,
    s.admission_date,
    s.emergency_contact_number
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN teachers t ON c.class_teacher_id = t.id;

-- View for student full details
CREATE OR REPLACE VIEW student_full_details AS
SELECT 
    s.*,
    c.class_name,
    c.grade,
    c.class_letter,
    ct.name_with_initials AS class_teacher_name,
    vct.name_with_initials AS vice_class_teacher_name,
    EXTRACT(YEAR FROM AGE(s.date_of_birth)) AS age
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN teachers ct ON c.class_teacher_id = ct.id
LEFT JOIN teachers vct ON c.vice_class_teacher_id = vct.id;

-- View for subjects with assigned teachers
CREATE OR REPLACE VIEW subjects_with_teachers AS
SELECT 
    s.id AS subject_id,
    s.subject_code,
    s.subject_name,
    s.subject_type,
    s.applicable_grades,
    STRING_AGG(t.name_with_initials, ', ' ORDER BY t.name_with_initials) AS assigned_teachers,
    ARRAY_AGG(t.id ORDER BY t.name_with_initials) AS teacher_ids
FROM subjects s
LEFT JOIN subject_teachers st ON s.id = st.subject_id
LEFT JOIN teachers t ON st.teacher_id = t.id
GROUP BY s.id, s.subject_code, s.subject_name, s.subject_type, s.applicable_grades;

-- View for class information with teachers and monitors
DROP VIEW IF EXISTS class_full_info;
CREATE OR REPLACE VIEW class_full_info AS
SELECT 
    c.id,
    c.grade,
    c.class_letter,
    c.class_name,
    c.class_teacher_id,
    c.vice_class_teacher_id,
    c.class_monitor_id,
    c.vice_class_monitor_id,
    ct.name_with_initials AS class_teacher_name,
    vct.name_with_initials AS vice_class_teacher_name,
    cm.name_with_initials AS class_monitor_name,
    vcm.name_with_initials AS vice_class_monitor_name,
    COUNT(s.id) AS student_count
FROM classes c
LEFT JOIN teachers ct ON c.class_teacher_id = ct.id
LEFT JOIN teachers vct ON c.vice_class_teacher_id = vct.id
LEFT JOIN students cm ON c.class_monitor_id = cm.id
LEFT JOIN students vcm ON c.vice_class_monitor_id = vcm.id
LEFT JOIN students s ON s.class_id = c.id
GROUP BY c.id, c.grade, c.class_letter, c.class_name, 
         c.class_teacher_id, c.vice_class_teacher_id,
         c.class_monitor_id, c.vice_class_monitor_id,
         ct.name_with_initials, vct.name_with_initials,
         cm.name_with_initials, vcm.name_with_initials;

-- View for student attendance summary
CREATE OR REPLACE VIEW student_attendance_summary AS
SELECT 
    s.id AS student_id,
    s.name_with_initials,
    s.admission_no,
    c.class_name,
    COUNT(a.id) AS total_days,
    SUM(CASE WHEN a.status = TRUE THEN 1 ELSE 0 END) AS present_days,
    SUM(CASE WHEN a.status = FALSE THEN 1 ELSE 0 END) AS absent_days,
    ROUND(
        (SUM(CASE WHEN a.status = TRUE THEN 1 ELSE 0 END)::DECIMAL / 
         NULLIF(COUNT(a.id), 0) * 100), 2
    ) AS attendance_percentage
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.name_with_initials, s.admission_no, c.class_name;

-- View for student marks with grades
CREATE OR REPLACE VIEW student_marks_detailed AS
SELECT 
    m.id,
    m.student_id,
    s.admission_no,
    s.name_with_initials AS student_name,
    m.class_id,
    c.class_name,
    m.subject_id,
    sub.subject_code,
    sub.subject_name,
    m.exam_name,
    m.exam_date,
    m.marks,
    CASE 
        WHEN m.marks >= 75 THEN 'A'
        WHEN m.marks >= 65 THEN 'B'
        WHEN m.marks >= 50 THEN 'C'
        WHEN m.marks >= 35 THEN 'S'
        ELSE 'W'
    END AS grade,
    m.entered_by,
    t.name_with_initials AS entered_by_teacher,
    m.approval_status,
    m.approved_by,
    approver.name_with_initials AS approved_by_name,
    m.approved_at,
    m.recheck_reason,
    m.created_at,
    m.updated_at
FROM marks m
JOIN students s ON m.student_id = s.id
JOIN classes c ON m.class_id = c.id
JOIN subjects sub ON m.subject_id = sub.id
LEFT JOIN teachers t ON m.entered_by = t.id
LEFT JOIN teachers approver ON m.approved_by = approver.id;

-- View for pending marks submissions (for admin approval)
CREATE OR REPLACE VIEW marks_pending_approval AS
SELECT 
    m.id,
    m.student_id,
    s.admission_no,
    s.name_with_initials AS student_name,
    c.class_name,
    sub.subject_name,
    m.exam_name,
    m.marks,
    t.name_with_initials AS entered_by_name,
    m.created_at
FROM marks m
JOIN students s ON m.student_id = s.id
JOIN classes c ON m.class_id = c.id
JOIN subjects sub ON m.subject_id = sub.id
LEFT JOIN teachers t ON m.entered_by = t.id
WHERE m.approval_status = 'Pending'
ORDER BY m.created_at DESC;

-- ==================== FUNCTIONS ====================

-- Function to get student's selected subjects
CREATE OR REPLACE FUNCTION get_student_subjects(p_student_id UUID)
RETURNS TABLE (
    subject_id UUID,
    subject_code TEXT,
    subject_name TEXT,
    subject_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.subject_code,
        s.subject_name,
        s.subject_type
    FROM student_subjects ss
    JOIN subjects s ON ss.subject_id = s.id
    WHERE ss.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate age
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$ LANGUAGE plpgsql;

-- Function to get available basket subjects for a grade
CREATE OR REPLACE FUNCTION get_basket_subjects_for_grade(p_grade INTEGER)
RETURNS TABLE (
    subject_id UUID,
    subject_code TEXT,
    subject_name TEXT,
    subject_type TEXT,
    basket_category TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.subject_code,
        s.subject_name,
        s.subject_type,
        CASE 
            WHEN s.subject_type LIKE '%Grade 6-9%' THEN 'General Basket'
            WHEN s.subject_type LIKE '%1st Basket%' THEN '1st Basket'
            WHEN s.subject_type LIKE '%2nd Basket%' THEN '2nd Basket'
            WHEN s.subject_type LIKE '%3rd Basket%' THEN '3rd Basket'
            ELSE 'Main'
        END AS basket_category
    FROM subjects s
    WHERE p_grade = ANY(s.applicable_grades)
    AND s.subject_type LIKE '%Basket%'
    ORDER BY s.subject_type, s.subject_name;
END;
$$ LANGUAGE plpgsql;

-- ==================== TRIGGERS ====================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate admission number if not provided
CREATE OR REPLACE FUNCTION generate_admission_no()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
    new_admission_no TEXT;
BEGIN
    -- Only generate if admission_no is NULL
    IF NEW.admission_no IS NULL THEN
        -- Get the highest existing admission number
        SELECT COALESCE(
            MAX(CAST(SUBSTRING(admission_no FROM 4) AS INTEGER)), 
            0
        ) INTO next_num
        FROM students
        WHERE admission_no ~ '^STU[0-9]+$';
        
        -- Generate new admission number
        next_num := next_num + 1;
        new_admission_no := 'STU' || LPAD(next_num::TEXT, 4, '0');
        
        -- Assign the generated admission number
        NEW.admission_no := new_admission_no;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_student_admission_no BEFORE INSERT ON students
    FOR EACH ROW EXECUTE FUNCTION generate_admission_no();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marks_updated_at BEFORE UPDATE ON marks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== SUPPORT TICKETS TABLE ====================
-- This table handles teacher support requests to admin
CREATE TABLE support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT CHECK (category IN ('Technical', 'Academic', 'Administrative', 'Other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    admin_response TEXT,
    admin_response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for support_tickets
CREATE INDEX idx_support_tickets_teacher ON support_tickets(teacher_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created ON support_tickets(created_at DESC);

-- Create trigger for support_tickets
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== NOTIFICATIONS TABLE ====================
-- This table stores all types of notifications for teachers
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('support', 'marks', 'timetable', 'system', 'attendance', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    metadata JSONB, -- Additional data specific to notification type
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_teacher ON notifications(teacher_id);
CREATE INDEX idx_notifications_unread ON notifications(teacher_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ==================== SAMPLE DATA (OPTIONAL) ====================
-- Uncomment to insert sample data

-- Sample Teachers
/*
INSERT INTO teachers (full_name, name_with_initials, appointed_date, teacher_grade, subject_specialization, contact_number, emergency_contact_number, email) VALUES
('John Michael Smith', 'J.M. Smith', '2015-01-10', 'Grade 1', 'Mathematics', '+94771234567', '+94781234567', 'john.smith@school.com'),
('Sarah Anne Johnson', 'S.A. Johnson', '2018-03-15', 'Grade 2', 'English', '+94772234567', '+94782234567', 'sarah.johnson@school.com'),
('Michael Robert Brown', 'M.R. Brown', '2020-06-20', 'Grade 3', 'Science', '+94773234567', '+94783234567', 'michael.brown@school.com');
*/

-- ==================== COMPLETION ====================
SELECT 'Database schema created successfully!' AS status,
       'Tables: teachers, students, classes, subjects, attendance, marks' AS tables_created,
       'Views: student_brief_view, student_full_details, subjects_with_teachers, etc.' AS views_created;
