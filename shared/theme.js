// Theme Management Script
// This script loads and applies the saved theme across all admin pages

(function() {
    // Get background color with opacity
    function getBackgroundColor(colorTheme, customColor, opacity) {
        const baseColors = {
            'white': '#FFFFFF',
            'light-gray': '#F5F5F5',
            'soft-blue': '#E3F2FD',
            'soft-green': '#E8F5E9',
            'soft-purple': '#F3E5F5',
            'warm-beige': '#FFF8E1',
            'custom-bg': customColor || '#FFFFFF'
        };
        
        const opacityValues = {
            'subtle': 0.3,
            'light': 0.5,
            'medium': 0.7,
            'regular': 1.0
        };
        
        const color = baseColors[colorTheme] || baseColors['white'];
        const alpha = opacityValues[opacity] || opacityValues['subtle'];
        
        // Convert hex to rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        // For white, apply opacity differently to avoid gray
        if (colorTheme === 'white') {
            return '#FFFFFF';
        }
        
        // Mix with white background
        const mixedR = Math.round(255 + (r - 255) * alpha);
        const mixedG = Math.round(255 + (g - 255) * alpha);
        const mixedB = Math.round(255 + (b - 255) * alpha);
        
        return `rgb(${mixedR}, ${mixedG}, ${mixedB})`;
    }

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
                
                // Apply dark/light theme
                if (parsed.theme === 'dark') {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                    
                    // Apply background color in light mode
                    if (parsed.bgColor) {
                        const bgColor = getBackgroundColor(
                            parsed.bgColor || 'white',
                            parsed.customBgColor || '',
                            parsed.bgOpacity || 'subtle'
                        );
                        document.body.style.backgroundColor = bgColor;
                    }
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
