// Admin Navigation - Profile Dropdown

// Toggle profile dropdown
function toggleAdminProfile() {
    const dropdown = document.getElementById('adminProfileDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('adminProfileDropdown');
    const profileBtn = document.querySelector('.profile-btn');
    
    if (dropdown && profileBtn) {
        if (!profileBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    }
});

// Load admin name
async function loadAdminName() {
    try {
        const user = getCurrentUser();
        if (!user || !user.email) {
            console.error('No user found');
            return;
        }

        // Extract name from email (before @) or use "Admin"
        const adminNameElement = document.getElementById('adminName');
        if (adminNameElement) {
            // Try to get a friendly name from email
            const emailName = user.email.split('@')[0];
            const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1).replace(/[._]/g, ' ');
            adminNameElement.textContent = displayName || 'Admin';
        }
    } catch (error) {
        console.error('Error loading admin name:', error);
        // Keep default "Admin" text if error occurs
    }
}

// Load admin notification count
async function loadAdminNotifications() {
    try {
        // Count pending support tickets
        const count = await getPendingTicketsCount();
        const badge = document.getElementById('adminNotificationBadge');
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error loading admin notifications:', error);
    }
}

// Initialize admin name and notifications on page load
window.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure auth.js and api.js are loaded
    setTimeout(() => {
        loadAdminName();
        loadAdminNotifications();
        
        // Refresh notifications every 30 seconds
        setInterval(loadAdminNotifications, 30000);
    }, 100);
});
