// Admin Navbar - Settings and Notifications Functions
// This file should be included in all admin pages

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Inject modals if not already present
    if (!document.getElementById('settingsDropdown')) {
        injectModals();
    }
    
    // Load initial data
    loadSettings();
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    setInterval(loadNotifications, 30000);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const settingsDropdown = document.getElementById('settingsDropdown');
        const notifDropdown = document.getElementById('notificationsDropdown');
        
        if (settingsDropdown && notifDropdown &&
            !event.target.closest('.nav-links') && 
            !event.target.closest('#settingsDropdown') && 
            !event.target.closest('#notificationsDropdown')) {
            settingsDropdown.style.display = 'none';
            notifDropdown.style.display = 'none';
        }
    });
});

// Inject modals into the page
function injectModals() {
    const modalsHTML = `
        <!-- Settings Dropdown Modal -->
        <div id="settingsDropdown" style="display: none; position: fixed; top: 60px; right: 100px; width: 350px; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-height: 80vh; overflow-y: auto;">
            <div style="padding: 1.5rem; border-bottom: 1px solid #eee;">
                <h3 style="margin: 0; font-size: 1.25rem;">⚙️ Settings</h3>
            </div>
            <div style="padding: 1.5rem;">
                <!-- School Timings -->
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: #333;">School Timings</h4>
                    <div style="display: grid; gap: 1rem;">
                        <div class="form-group">
                            <label style="font-size: 0.9rem;">School Start Time</label>
                            <select id="schoolStartTime" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="07:30">7:30 AM</option>
                                <option value="08:00" selected>8:00 AM</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="font-size: 0.9rem;">School End Time</label>
                            <select id="schoolEndTime" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="13:30">1:30 PM</option>
                                <option value="14:00" selected>2:00 PM</option>
                            </select>
                        </div>
                    </div>
                    <button onclick="saveTimings()" class="btn btn-primary" style="width: 100%; margin-top: 0.75rem; padding: 0.5rem;">Save Timings</button>
                </div>

                <!-- Theme Settings -->
                <div style="margin-bottom: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #eee;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: #333;">Theme Settings</h4>
                    <div class="form-group">
                        <label style="font-size: 0.9rem;">Theme</label>
                        <select id="themeSelect" onchange="previewTheme()" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="light">Light Theme</option>
                            <option value="dark">Dark Theme</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                        <button onclick="saveTheme()" class="btn btn-primary" style="flex: 1; padding: 0.5rem;">Save</button>
                        <button onclick="resetTheme()" class="btn" style="flex: 1; padding: 0.5rem;">Reset</button>
                    </div>
                </div>

                <!-- Academic Year Settings -->
                <div style="padding-top: 1.5rem; border-top: 1px solid #eee;">
                    <h4 style="margin: 0 0 1rem 0; font-size: 1rem; color: #333;">Academic Year</h4>
                    <div style="display: grid; gap: 1rem;">
                        <div class="form-group">
                            <label style="font-size: 0.9rem;">Current Academic Year</label>
                            <input type="text" id="academicYear" placeholder="e.g., 2025" value="2025" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div class="form-group">
                            <label style="font-size: 0.9rem;">School Name</label>
                            <input type="text" id="schoolName" placeholder="Enter school name" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                    </div>
                    <button onclick="saveAcademicSettings()" class="btn btn-primary" style="width: 100%; margin-top: 0.75rem; padding: 0.5rem;">Save Settings</button>
                </div>
            </div>
        </div>

        <!-- Notifications Dropdown Modal -->
        <div id="notificationsDropdown" style="display: none; position: fixed; top: 60px; right: 150px; width: 400px; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-height: 500px; overflow-y: auto;">
            <div style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.25rem;">🔔 Notifications</h3>
                <button onclick="markAllAsRead()" style="background: none; border: none; color: #4CAF50; cursor: pointer; font-size: 0.85rem; text-decoration: underline;">Mark all as read</button>
            </div>
            <div id="notificationsList" style="padding: 0;">
                <!-- Notifications will be loaded here -->
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', modalsHTML);
}

// ============= Settings Functions =============
let schoolSettings = {
    startTime: '08:00',
    endTime: '14:00',
    theme: 'light',
    academicYear: '2025',
    schoolName: ''
};

// Toggle settings dropdown
function toggleSettings(event) {
    event.preventDefault();
    const dropdown = document.getElementById('settingsDropdown');
    const notifDropdown = document.getElementById('notificationsDropdown');
    
    if (notifDropdown.style.display === 'block') {
        notifDropdown.style.display = 'none';
    }
    
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        loadSettings();
    }
}

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('schoolSettings');
    if (saved) {
        schoolSettings = JSON.parse(saved);
        const startTimeEl = document.getElementById('schoolStartTime');
        const endTimeEl = document.getElementById('schoolEndTime');
        const themeEl = document.getElementById('themeSelect');
        const academicYearEl = document.getElementById('academicYear');
        const schoolNameEl = document.getElementById('schoolName');
        
        if (startTimeEl) startTimeEl.value = schoolSettings.startTime;
        if (endTimeEl) endTimeEl.value = schoolSettings.endTime;
        if (themeEl) themeEl.value = schoolSettings.theme;
        if (academicYearEl) academicYearEl.value = schoolSettings.academicYear || '2025';
        if (schoolNameEl) schoolNameEl.value = schoolSettings.schoolName || '';
        applyTheme(schoolSettings.theme);
    }
}

// Save timings
function saveTimings() {
    schoolSettings.startTime = document.getElementById('schoolStartTime').value;
    schoolSettings.endTime = document.getElementById('schoolEndTime').value;
    
    localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
    showToast('School timings saved successfully!', 'success');
}

// Save theme
function saveTheme() {
    schoolSettings.theme = document.getElementById('themeSelect').value;
    localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
    applyTheme(schoolSettings.theme);
    showToast('Theme saved successfully!', 'success');
}

// Reset theme
function resetTheme() {
    schoolSettings.theme = 'light';
    document.getElementById('themeSelect').value = 'light';
    localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
    applyTheme('light');
    showToast('Theme reset to default (Light)', 'info');
}

// Preview theme
function previewTheme() {
    const theme = document.getElementById('themeSelect').value;
    applyTheme(theme);
}

// Apply theme
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Save academic settings
function saveAcademicSettings() {
    schoolSettings.academicYear = document.getElementById('academicYear').value;
    schoolSettings.schoolName = document.getElementById('schoolName').value;
    
    localStorage.setItem('schoolSettings', JSON.stringify(schoolSettings));
    showToast('Academic settings saved successfully!', 'success');
}

// ============= Notifications Functions =============
let notifications = [];
let unreadCount = 0;

// Toggle notifications dropdown
function toggleNotifications(event) {
    event.preventDefault();
    const dropdown = document.getElementById('notificationsDropdown');
    const settingsDropdown = document.getElementById('settingsDropdown');
    
    if (settingsDropdown.style.display === 'block') {
        settingsDropdown.style.display = 'none';
    }
    
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
        loadNotifications();
    }
}

// Load notifications
async function loadNotifications() {
    try {
        const supabase = getSupabaseClient();
        
        // Get notifications for admin (teacher_id is null for admin notifications)
        const { data: notifData, error: notifError } = await supabase
            .from('notifications')
            .select('*')
            .is('teacher_id', null)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(10);

        if (notifError) {
            console.error('Notification query error:', notifError);
            // Don't throw, just set empty notifications
            notifications = [];
        } else {
            notifications = notifData.map(notif => ({
                id: notif.id,
                type: notif.type,
                title: notif.title,
                message: notif.message,
                time: new Date(notif.created_at),
                read: notif.is_read,
                link: notif.link || '/admin/marks-approval.html'
            }));
        }

        // Load read status from localStorage
        const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        notifications.forEach(notif => {
            if (readNotifications.includes(notif.id)) {
                notif.read = true;
            }
        });

        displayNotifications();
        updateNotificationBadge();
    } catch (error) {
        console.error('Error loading notifications:', error);
        const notifList = document.getElementById('notificationsList');
        if (notifList) {
            notifList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #666;">
                    <p>Error loading notifications</p>
                </div>
            `;
        }
    }
}

// Display notifications
function displayNotifications() {
    const container = document.getElementById('notificationsList');
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666;">
                <p style="font-size: 2rem; margin-bottom: 0.5rem;">✓</p>
                <p>No notifications</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notifications.map(notif => {
        const timeAgo = getTimeAgo(notif.time);
        const bgColor = notif.read ? '#f9f9f9' : '#e3f2fd';
        return `
            <div onclick="markAsReadAndNavigate('${notif.id}', '${notif.link}')" 
                 style="padding: 1rem 1.5rem; border-bottom: 1px solid #eee; cursor: pointer; background: ${bgColor}; transition: background 0.2s;"
                 onmouseover="this.style.background='#f5f5f5'" 
                 onmouseout="this.style.background='${bgColor}'">
                <div style="display: flex; align-items: start; gap: 0.75rem;">
                    ${notif.read ? '' : '<div style="width: 8px; height: 8px; background: #4CAF50; border-radius: 50%; margin-top: 6px; flex-shrink: 0;"></div>'}
                    <div style="flex: 1; ${notif.read ? 'margin-left: 20px;' : ''}">
                        <div style="font-weight: ${notif.read ? 'normal' : 'bold'}; font-size: 0.95rem; margin-bottom: 0.25rem;">${notif.title}</div>
                        <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">${notif.message}</div>
                        <div style="font-size: 0.75rem; color: #999;">${timeAgo}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
    
    return 'Just now';
}

// Mark as read and navigate
function markAsReadAndNavigate(notifId, link) {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    if (!readNotifications.includes(notifId)) {
        readNotifications.push(notifId);
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    }
    window.location.href = link;
}

// Mark all as read
function markAllAsRead() {
    const readNotifications = notifications.map(n => n.id);
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    notifications.forEach(n => n.read = true);
    displayNotifications();
    updateNotificationBadge();
}

// Update notification badge
function updateNotificationBadge() {
    unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.style.display = 'block';
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        } else {
            badge.style.display = 'none';
        }
    }
}
