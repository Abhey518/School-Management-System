// API Functions for School Management System - Enhanced Version
// Reusable database operations using Supabase

// ==================== STUDENTS ====================

/**
 * Get all students with brief information
 * @returns {Promise<Array>} List of students
 */
async function getStudents() {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('student_brief_view')
            .select('*')
            .order('admission_no', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching students:', error);
        return [];
    }
}

/**
 * Get student full details by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Student details
 */
async function getStudentDetails(id) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('student_full_details')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching student details:', error);
        throw error;
    }
}

/**
 * Filter students by various criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered students
 */
async function filterStudents(filters) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        let query = client.from('student_brief_view').select('*');

        if (filters.grade) {
            query = query.eq('grade', filters.grade);
        }
        if (filters.class_letter) {
            query = query.eq('class_letter', filters.class_letter);
        }
        if (filters.class_teacher_id) {
            query = query.eq('class_teacher_id', filters.class_teacher_id);
        }
        if (filters.birth_year) {
            query = query.eq('birth_year', filters.birth_year);
        }

        const { data, error } = await query.order('admission_no', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error filtering students:', error);
        return [];
    }
}

/**
 * Add a new student with full details
 * @param {Object} studentData - Student information including guardian details
 * @returns {Promise<Object>} Created student
 */
async function addStudent(studentData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Ensure required fields are present
        const requiredFields = ['full_name', 'name_with_initials', 'date_of_birth', 'admission_date', 'class_id'];
        for (const field of requiredFields) {
            if (!studentData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const { data, error } = await client
            .from('students')
            .insert([studentData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
}

/**
 * Update a student with validation
 * @param {string} id - Student ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated student
 */
async function updateStudent(id, updates) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Remove read-only fields
        delete updates.admission_no;
        delete updates.created_at;
        delete updates.updated_at;

        const { data, error } = await client
            .from('students')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}

/**
 * Delete a student
 * @param {string} id - Student ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteStudentById(id) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { error } = await client
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}

// ==================== TEACHERS ====================

/**
 * Get all teachers with subjects
 * @returns {Promise<Array>} List of teachers
 */
async function getTeachers() {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('teachers')
            .select('*, subject_teachers(subject_id, subjects(subject_name))')
            .order('appointed_date', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return [];
    }
}

/**
 * Get teacher by ID
 * @param {string} id - Teacher ID
 * @returns {Promise<Object>} Teacher details
 */
async function getTeacherById(id) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('teachers')
            .select('*, subject_teachers(subject_id, subjects(subject_name, subject_code))')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching teacher:', error);
        throw error;
    }
}

/**
 * Add a new teacher with validation
 * @param {Object} teacherData - Teacher information
 * @returns {Promise<Object>} Created teacher
 */
async function addTeacher(teacherData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Validate required fields
        const requiredFields = ['full_name', 'name_with_initials', 'appointed_date', 'teacher_grade'];
        for (const field of requiredFields) {
            if (!teacherData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const { data, error } = await client
            .from('teachers')
            .insert([teacherData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding teacher:', error);
        throw error;
    }
}

/**
 * Update a teacher with validation
 * @param {string} id - Teacher ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated teacher
 */
async function updateTeacher(id, updates) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Remove read-only fields
        delete updates.created_at;
        delete updates.updated_at;

        const { data, error } = await client
            .from('teachers')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
}

/**
 * Delete a teacher
 * @param {string} id - Teacher ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteTeacherById(id) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { error } = await client
            .from('teachers')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting teacher:', error);
        throw error;
    }
}

// ==================== CLASSES ====================

/**
 * Get all classes with full information
 * @returns {Promise<Array>} List of classes
 */
async function getClasses() {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('class_full_info')
            .select('*')
            .order('grade', { ascending: true })
            .order('class_letter', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching classes:', error);
        return [];
    }
}

/**
 * Get class by ID with full details
 * @param {string} id - Class ID
 * @returns {Promise<Object>} Class details
 */
async function getClassById(id) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('class_full_info')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching class:', error);
        throw error;
    }
}

/**
 * Add a new class with validation
 * @param {Object} classData - Class information
 * @returns {Promise<Object>} Created class
 */
async function addClass(classData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Validate required fields
        const requiredFields = ['grade', 'class_letter', 'class_teacher_id'];
        for (const field of requiredFields) {
            if (!classData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const { data, error } = await client
            .from('classes')
            .insert([classData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding class:', error);
        throw error;
    }
}

/**
 * Update a class with validation
 * @param {string} id - Class ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated class
 */
async function updateClass(id, updates) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Remove read-only fields
        delete updates.class_name;
        delete updates.created_at;
        delete updates.updated_at;

        const { data, error } = await client
            .from('classes')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating class:', error);
        throw error;
    }
}

/**
 * Delete a class
 * @param {string} id - Class ID
 * @returns {Promise<boolean>} Success status
 */
async function deleteClassById(id) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { error } = await client
            .from('classes')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting class:', error);
        throw error;
    }
}

// ==================== SUBJECTS ====================

/**
 * Get all subjects with teacher assignments
 * @returns {Promise<Array>} List of subjects
 */
async function getSubjects() {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('subjects_with_teachers')
            .select('*')
            .order('subject_code', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return [];
    }
}

/**
 * Get subjects for a specific grade
 * @param {number} grade - Grade level (6-11)
 * @returns {Promise<Array>} List of subjects
 */
async function getSubjectsForGrade(grade) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .rpc('get_basket_subjects_for_grade', { grade_level: grade });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching subjects for grade:', error);
        throw error;
    }
}

/**
 * Assign teacher to subject
 * @param {string} teacherId - Teacher ID
 * @param {string} subjectId - Subject ID
 * @returns {Promise<Object>} Created assignment
 */
async function assignTeacherToSubject(teacherId, subjectId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('subject_teachers')
            .insert([{ teacher_id: teacherId, subject_id: subjectId }])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error assigning teacher to subject:', error);
        throw error;
    }
}

/**
 * Remove teacher from subject
 * @param {string} teacherId - Teacher ID
 * @param {string} subjectId - Subject ID
 * @returns {Promise<boolean>} Success status
 */
async function removeTeacherFromSubject(teacherId, subjectId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { error } = await client
            .from('subject_teachers')
            .delete()
            .eq('teacher_id', teacherId)
            .eq('subject_id', subjectId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing teacher from subject:', error);
        throw error;
    }
}

/**
 * Get subjects assigned to a student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} List of subjects
 */
async function getStudentSubjects(studentId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .rpc('get_student_subjects', { p_student_id: studentId });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching student subjects:', error);
        throw error;
    }
}

/**
 * Assign subjects to student (basket subjects)
 * @param {string} studentId - Student ID
 * @param {Array<string>} subjectIds - Array of subject IDs
 * @returns {Promise<Array>} Created assignments
 */
async function assignSubjectsToStudent(studentId, subjectIds) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const assignments = subjectIds.map(subjectId => ({
            student_id: studentId,
            subject_id: subjectId
        }));

        const { data, error } = await client
            .from('student_subjects')
            .insert(assignments)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error assigning subjects to student:', error);
        throw error;
    }
}

/**
 * Remove subject from student
 * @param {string} studentId - Student ID
 * @param {string} subjectId - Subject ID
 * @returns {Promise<boolean>} Success status
 */
async function removeSubjectFromStudent(studentId, subjectId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { error } = await client
            .from('student_subjects')
            .delete()
            .eq('student_id', studentId)
            .eq('subject_id', subjectId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing subject from student:', error);
        throw error;
    }
}

// ==================== ATTENDANCE ====================

/**
 * Mark attendance for a student
 * @param {Object} attendanceData - Attendance information (student_id, subject_id, date, status)
 * @returns {Promise<Object>} Created attendance record
 */
async function markAttendance(attendanceData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Validate required fields
        const requiredFields = ['student_id', 'subject_id', 'date', 'status'];
        for (const field of requiredFields) {
            if (!attendanceData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const { data, error } = await client
            .from('attendance')
            .insert([attendanceData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw error;
    }
}

/**
 * Get attendance summary for a student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} List of attendance records
 */
async function getStudentAttendanceSummary(studentId) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('student_attendance_summary')
            .select('*')
            .eq('student_id', studentId);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        return [];
    }
}

/**
 * Get attendance by class and date
 * @param {string} classId - Class ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} List of attendance records
 */
async function getAttendanceByClassAndDate(classId, date) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('attendance')
            .select('*, students(full_name, name_with_initials), subjects(subject_name)')
            .eq('date', date)
            .in('student_id', 
                client.from('students').select('id').eq('class_id', classId)
            );

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return [];
    }
}

/**
 * Get attendance by subject and date
 * @param {string} subjectId - Subject ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} List of attendance records
 */
async function getAttendanceBySubjectAndDate(subjectId, date) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('attendance')
            .select('*, students(full_name, name_with_initials, class_id)')
            .eq('subject_id', subjectId)
            .eq('date', date)
            .order('students(class_id)', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return [];
    }
}

// ==================== MARKS ====================

/**
 * Add marks for a student
 * @param {Object} marksData - Marks information (student_id, subject_id, exam_type, marks, max_marks)
 * @returns {Promise<Object>} Created marks record
 */
async function addMarks(marksData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        // Validate required fields
        const requiredFields = ['student_id', 'subject_id', 'exam_type', 'marks', 'max_marks'];
        for (const field of requiredFields) {
            if (marksData[field] === undefined || marksData[field] === null) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const { data, error } = await client
            .from('marks')
            .insert([marksData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error adding marks:', error);
        throw error;
    }
}

/**
 * Update marks
 * @param {string} id - Marks record ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated marks record
 */
async function updateMarks(id, updates) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('marks')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating marks:', error);
        throw error;
    }
}

/**
 * Get detailed marks for a student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} List of marks records with subject details
 */
async function getStudentMarksDetailed(studentId) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('student_marks_detailed')
            .select('*')
            .eq('student_id', studentId)
            .order('exam_type', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching student marks:', error);
        return [];
    }
}

/**
 * Get marks by subject and exam
 * @param {string} subjectId - Subject ID
 * @param {string} examType - Exam type (e.g., 'Term 1', 'Term 2', 'Final')
 * @returns {Promise<Array>} List of marks records
 */
async function getMarksBySubjectAndExam(subjectId, examType) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('marks')
            .select('*, students(full_name, name_with_initials, class_id)')
            .eq('subject_id', subjectId)
            .eq('exam_type', examType)
            .order('marks', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching marks:', error);
        return [];
    }
}

/**
 * Get marks by class and exam
 * @param {string} classId - Class ID
 * @param {string} examType - Exam type
 * @returns {Promise<Array>} List of marks records
 */
async function getMarksByClassAndExam(classId, examType) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return [];
        }

        const { data, error } = await client
            .from('marks')
            .select('*, students!inner(full_name, name_with_initials, class_id), subjects(subject_name)')
            .eq('students.class_id', classId)
            .eq('exam_type', examType)
            .order('students.name_with_initials', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching marks:', error);
        return [];
    }
}

// ==================== SUPPORT TICKETS ====================

/**
 * Create a support ticket
 * @param {Object} ticketData - Ticket information
 * @returns {Promise<Object>} Created ticket
 */
async function createSupportTicket(ticketData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('support_tickets')
            .insert([ticketData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating support ticket:', error);
        throw error;
    }
}

/**
 * Get support tickets for a teacher
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<Array>} List of tickets
 */
async function getTeacherTickets(teacherId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('support_tickets')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching teacher tickets:', error);
        return [];
    }
}

/**
 * Get all support tickets (for admin)
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} List of tickets
 */
async function getAllSupportTickets(status = null) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        let query = client
            .from('support_tickets')
            .select('*, teachers(full_name, name_with_initials, email)')
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching support tickets:', error);
        return [];
    }
}

/**
 * Update support ticket with admin response
 * @param {string} ticketId - Ticket ID
 * @param {Object} updateData - Update information
 * @returns {Promise<Object>} Updated ticket
 */
async function updateSupportTicket(ticketId, updateData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('support_tickets')
            .update(updateData)
            .eq('id', ticketId)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error updating support ticket:', error);
        throw error;
    }
}

/**
 * Get count of pending tickets (for notifications)
 * @returns {Promise<number>} Count of pending tickets
 */
async function getPendingTicketsCount() {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { count, error } = await client
            .from('support_tickets')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('Error fetching pending tickets count:', error);
        return 0;
    }
}

/**
 * Get count of tickets with admin responses that teacher hasn't seen
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<number>} Count of tickets with new responses
 */
async function getTeacherNotificationCount(teacherId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { count, error } = await client
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('teacher_id', teacherId)
            .eq('is_read', false);

        if (error) {
            // Fallback to support tickets if notifications table doesn't exist yet
            const { count: ticketCount, error: ticketError } = await client
                .from('support_tickets')
                .select('*', { count: 'exact', head: true })
                .eq('teacher_id', teacherId)
                .not('admin_response', 'is', null)
                .in('status', ['in_progress', 'resolved']);

            if (ticketError) throw ticketError;
            return ticketCount || 0;
        }
        
        return count || 0;
    } catch (error) {
        console.error('Error fetching teacher notification count:', error);
        return 0;
    }
}

// ==================== NOTIFICATIONS ====================

/**
 * Create a notification for a teacher
 * @param {Object} notificationData - Notification information
 * @returns {Promise<Object>} Created notification
 */
async function createNotification(notificationData) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('notifications')
            .insert([notificationData])
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}

/**
 * Get notifications for a teacher
 * @param {string} teacherId - Teacher ID
 * @param {boolean} unreadOnly - Only get unread notifications
 * @returns {Promise<Array>} List of notifications
 */
async function getTeacherNotifications(teacherId, unreadOnly = false) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        let query = client
            .from('notifications')
            .select('*')
            .eq('teacher_id', teacherId)
            .order('created_at', { ascending: false });

        if (unreadOnly) {
            query = query.eq('is_read', false);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
async function markNotificationAsRead(notificationId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { data, error } = await client
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .select();

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

/**
 * Mark all notifications as read for a teacher
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<void>}
 */
async function markAllNotificationsAsRead(teacherId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { error } = await client
            .from('notifications')
            .update({ is_read: true })
            .eq('teacher_id', teacherId)
            .eq('is_read', false);

        if (error) throw error;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
async function deleteNotification(notificationId) {
    try {
        const client = getSupabaseClient();
        if (!client) throw new Error('Supabase client not initialized');

        const { error } = await client
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
}

// Log API ready status
console.log('%c✅ API Functions Loaded - Enhanced Version', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
console.log('Students: getStudents, getStudentDetails, filterStudents, addStudent, updateStudent, deleteStudentById');
console.log('Teachers: getTeachers, getTeacherById, addTeacher, updateTeacher, deleteTeacherById');
console.log('Classes: getClasses, getClassById, addClass, updateClass, deleteClassById');
console.log('Subjects: getSubjects, getSubjectsForGrade, assignTeacherToSubject, removeTeacherFromSubject');
console.log('Student-Subjects: getStudentSubjects, assignSubjectsToStudent, removeSubjectFromStudent');
console.log('Attendance: markAttendance, getStudentAttendanceSummary, getAttendanceByClassAndDate, getAttendanceBySubjectAndDate');
console.log('Marks: addMarks, updateMarks, getStudentMarksDetailed, getMarksBySubjectAndExam, getMarksByClassAndExam');
console.log('Support Tickets: createSupportTicket, getTeacherTickets, getAllSupportTickets, updateSupportTicket, getPendingTicketsCount');
console.log('Notifications: createNotification, getTeacherNotifications, getTeacherNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification');
