// Teacher Navigation - Profile Dropdown and Name Display

// Toggle profile dropdown
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (dropdown && profileBtn) {
        if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    }
});

// Load teacher name from database
async function loadTeacherName() {
    try {
        const user = getCurrentUser();
        if (!user || !user.teacherId) {
            console.error('No teacher ID found');
            return;
        }

        // Get teacher details from database
        const teacher = await getTeacherById(user.teacherId);
        
        if (teacher && (teacher.full_name || teacher.name_with_initials)) {
            const teacherNameElement = document.getElementById('teacherName');
            if (teacherNameElement) {
                teacherNameElement.textContent = teacher.full_name || teacher.name_with_initials;
            }
        }
    } catch (error) {
        console.error('Error loading teacher name:', error);
        // Keep default "Teacher" text if error occurs
    }
}

// Load notification count
async function loadTeacherNotifications() {
    try {
        const user = getCurrentUser();
        if (!user || !user.teacherId) {
            return;
        }

        const count = await getTeacherNotificationCount(user.teacherId);
        const badge = document.getElementById('teacherNotificationBadge');
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Initialize teacher name and notifications on page load
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure auth.js and api.js are loaded
    setTimeout(() => {
        loadTeacherName();
        loadTeacherNotifications();
        
        // Refresh notifications every 30 seconds
        setInterval(loadTeacherNotifications, 30000);
    }, 100);
});
