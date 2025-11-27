// Teacher Portal JavaScript Functions

console.log('Teacher Portal JS Loaded');

// Initialize teacher portal
function initTeacherPortal() {
    console.log('Initializing Teacher Portal...');
    
    // Check if user is logged in (in production, implement proper authentication)
    const isAuthenticated = true; // Replace with actual auth check
    
    if (!isAuthenticated) {
        window.location.href = '../index.html';
        return;
    }
    
    // Set active navigation
    setActiveNavigation();
}

// Set active navigation link based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Calculate attendance percentage
function calculateAttendancePercentage(present, total) {
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
}

// Get grade from marks
function getGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
}

// Calculate average marks
function calculateAverage(marksArray) {
    if (!marksArray || marksArray.length === 0) return 0;
    const sum = marksArray.reduce((acc, mark) => acc + mark, 0);
    return Math.round(sum / marksArray.length);
}

// Validate marks input (0-100)
function validateMarks(marks) {
    const marksNum = parseInt(marks);
    return !isNaN(marksNum) && marksNum >= 0 && marksNum <= 100;
}

// Mark all students present
function markAllPresent() {
    const radios = document.querySelectorAll('input[type="radio"][value="present"]');
    radios.forEach(radio => {
        radio.checked = true;
    });
    showNotification('All students marked present', 'success');
}

// Mark all students absent
function markAllAbsent() {
    const radios = document.querySelectorAll('input[type="radio"][value="absent"]');
    radios.forEach(radio => {
        radio.checked = true;
    });
    showNotification('All students marked absent', 'info');
}

// Export attendance to CSV
function exportAttendanceCSV(className, date, attendanceData) {
    if (!attendanceData || attendanceData.length === 0) {
        showNotification('No attendance data to export', 'error');
        return;
    }
    
    let csv = 'Student Name,Admission No,Status\n';
    attendanceData.forEach(record => {
        csv += `${record.studentName},${record.admissionNo},${record.status ? 'Present' : 'Absent'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${className}_${date}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Attendance exported successfully', 'success');
}

// Export marks to CSV
function exportMarksCSV(className, exam, marksData) {
    if (!marksData || marksData.length === 0) {
        showNotification('No marks data to export', 'error');
        return;
    }
    
    let csv = 'Student Name,Admission No,Subject,Marks,Grade\n';
    marksData.forEach(record => {
        const grade = getGrade(record.marks);
        csv += `${record.studentName},${record.admissionNo},${record.subject},${record.marks},${grade}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marks_${className}_${exam}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Marks exported successfully', 'success');
}

// Get current time slot
function getCurrentTimeSlot() {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 8 && hour < 9) return '8:00 - 9:00';
    if (hour >= 9 && hour < 10) return '9:00 - 10:00';
    if (hour >= 10 && hour < 11) return '10:30 - 11:30';
    if (hour >= 11 && hour < 12) return '11:30 - 12:30';
    if (hour >= 13 && hour < 14) return '1:30 - 2:30';
    
    return null;
}

// Highlight current period
function highlightCurrentPeriod() {
    const currentSlot = getCurrentTimeSlot();
    if (!currentSlot) return;
    
    const cells = document.querySelectorAll('.timetable-table td');
    cells.forEach(cell => {
        if (cell.textContent.includes(currentSlot)) {
            cell.style.background = '#fff3cd';
            cell.style.borderLeft = '4px solid #ffc107';
        }
    });
}

// Quick attendance shortcut
function setupAttendanceShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl + P for marking all present
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            markAllPresent();
        }
        // Ctrl + A for marking all absent
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            markAllAbsent();
        }
    });
}

// Initialize portal on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTeacherPortal();
        highlightCurrentPeriod();
        setupAttendanceShortcuts();
    });
} else {
    initTeacherPortal();
    highlightCurrentPeriod();
    setupAttendanceShortcuts();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console helper for shortcuts
console.log('%c⌨️ Keyboard Shortcuts:', 'color: #4CAF50; font-size: 14px; font-weight: bold;');
console.log('%cCtrl + P: Mark all students present', 'color: #666;');
console.log('%cCtrl + A: Mark all students absent', 'color: #666;');
