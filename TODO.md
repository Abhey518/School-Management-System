# TODO List - School Management System

## High Priority

### 1. Authentication & Login System

- [ ] Create login system to identify teachers separately
- [ ] Implement role-based access (Admin, Teacher)
- [ ] Store teacher ID in session/localStorage on login
- [ ] Add password authentication
- [ ] Implement logout functionality that clears session

### 2. Student-Subject Assignment (Admin Portal)

- [ ] Create interface in Admin panel to assign subjects to students
- [ ] Handle special cases:
  - Religion subjects (not all students)
  - Basket subjects (different groups of students)
  - Main subjects (all students in class)
- [ ] Store subject assignments in database
- [ ] Create `student_subjects` table/relationship
- [ ] Add bulk assignment feature for main subjects
- [ ] Add individual assignment for basket/religion subjects

### 3. Marks Entry & Approval System

#### Teacher Side:

- [ ] Update marks entry to filter students by:
  - Class teacher is teaching
  - Subject teacher is assigned to
  - Only students enrolled in that subject
- [ ] Add exam name dropdown (First Term, Second Term, Third Term Examination)
- [ ] Display class name, subject name, exam name in marks entry form
- [ ] Show student admission no, name, and marks input field
- [ ] Submit marks for admin approval (mark as "Pending Approval")
- [ ] Add notification system for teachers
  - See approval status
  - See admin feedback/recheck requests

#### Admin Side:

- [ ] Create marks approval section in admin portal
- [ ] Show pending marks submissions from teachers
- [ ] Display: Teacher name, Class, Subject, Exam, Number of students
- [ ] Allow admin to:
  - View detailed marks entries
  - Approve marks
  - Request recheck with comments
- [ ] Add notification system for admin
  - Alert when new marks are submitted
  - Track pending approvals

### 4. Notification System

- [ ] Design notification database schema
- [ ] Create notification components for both admin and teacher portals
- [ ] Implement real-time or periodic notification updates
- [ ] Add notification badge/counter
- [ ] Mark notifications as read functionality

## Medium Priority

### 5. Timetable Enhancements

- [ ] Allow bulk period creation for recurring schedules
- [ ] Add copy timetable from one class to another feature
- [ ] Validate time conflicts (same teacher, two classes at same time)

### 6. Attendance Improvements

- [ ] Link attendance to timetable periods
- [ ] Add attendance reports by class/date range
- [ ] Export attendance to CSV/Excel

### 7. Reports & Analytics

- [ ] Student performance reports
- [ ] Class performance comparison
- [ ] Teacher workload reports
- [ ] Attendance statistics

## Low Priority

### 8. UI/UX Improvements

- [ ] Add loading spinners for async operations
- [ ] Improve mobile responsiveness
- [ ] Add confirmation dialogs for delete operations
- [ ] Add success/error toast notifications instead of alerts

### 9. Data Management

- [ ] Add data export features (CSV, Excel)
- [ ] Add data backup functionality
- [ ] Add data import features for bulk operations

### 10. Additional Features

- [ ] Parent portal (view student performance)
- [ ] SMS/Email notifications
- [ ] Academic calendar integration
- [ ] Fee management module

## Technical Debt

### Database

- [ ] Add database indexes for performance optimization
- [ ] Review and optimize SQL views
- [ ] Add database triggers for automatic updates

### Code Quality

- [ ] Add input validation on all forms
- [ ] Implement consistent error handling
- [ ] Add loading states for all async operations
- [ ] Refactor duplicate code into shared functions

### Security

- [ ] Implement proper authentication
- [ ] Add authorization checks on all API calls
- [ ] Sanitize user inputs
- [ ] Implement rate limiting
- [ ] Add CSRF protection

## Completed ✓

- ✅ Dark theme implementation across admin portal
- ✅ Timetable management system with add/edit/delete periods
- ✅ Settings page with school timings and theme
- ✅ Student, Teacher, Class, Subject CRUD operations
- ✅ Filter functionality for students and subjects
- ✅ Class full info view with proper relationships
- ✅ Teacher timetable view with mark complete functionality
- ✅ Time format display (12-hour AM/PM format)
- ✅ Full day schedule (8 periods + interval)
- ✅ Container width standardization (1400px) across all portals

---

**Last Updated:** November 30, 2025
