// Theme Management Script
// This script loads and applies the saved theme across all admin pages

(function() {
    // Load theme from localStorage and apply it immediately
    function initTheme() {
        // Ensure document.body exists
        if (!document.body) {
            return;
        }
        
        const settings = localStorage.getItem('schoolSettings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                if (parsed.theme === 'dark') {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            } catch (e) {
                console.error('Failed to parse theme settings:', e);
            }
        }
    }
    
    // Apply theme when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        // DOM already loaded
        initTheme();
    }
})();
