// Toast Notification System
// Usage: showToast('Message text', 'success'|'error'|'warning'|'info')

function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set colors based on type
    const colors = {
        success: { bg: '#10b981', icon: '✓' },
        error: { bg: '#ef4444', icon: '✕' },
        warning: { bg: '#f59e0b', icon: '⚠' },
        info: { bg: '#3b82f6', icon: 'ℹ' }
    };
    
    const color = colors[type] || colors.info;
    
    toast.style.cssText = `
        background: ${color.bg};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    `;
    
    toast.innerHTML = `
        <span style="font-size: 20px; font-weight: bold;">${color.icon}</span>
        <span style="flex: 1;">${message}</span>
        <span style="font-size: 18px; opacity: 0.7; margin-left: 10px;">×</span>
    `;
    
    // Add click to dismiss
    toast.onclick = () => removeToast(toast);
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Confirmation Modal System
// Usage: showConfirmDialog('Are you sure?', 'This action cannot be undone', callback)

function showConfirmDialog(title, message, onConfirm, onCancel = null) {
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease-out;
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: var(--card-bg, white);
        border-radius: 12px;
        padding: 24px;
        max-width: 450px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: scaleIn 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h3 style="margin: 0 0 12px 0; color: var(--text-color, #333); font-size: 20px; font-weight: 600;">${title}</h3>
            <p style="margin: 0; color: var(--text-secondary, #666); font-size: 14px; line-height: 1.5;">${message}</p>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
            <button id="confirm-cancel" style="
                padding: 10px 20px;
                border: 1px solid var(--border-color, #ddd);
                background: var(--bg-secondary, #f5f5f5);
                color: var(--text-color, #333);
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            ">Cancel</button>
            <button id="confirm-ok" style="
                padding: 10px 20px;
                border: none;
                background: #ef4444;
                color: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            ">Confirm</button>
        </div>
    `;
    
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    
    // Add hover effects
    const cancelBtn = modal.querySelector('#confirm-cancel');
    const okBtn = modal.querySelector('#confirm-ok');
    
    cancelBtn.onmouseover = () => cancelBtn.style.background = 'var(--bg-hover, #e5e5e5)';
    cancelBtn.onmouseout = () => cancelBtn.style.background = 'var(--bg-secondary, #f5f5f5)';
    
    okBtn.onmouseover = () => okBtn.style.background = '#dc2626';
    okBtn.onmouseout = () => okBtn.style.background = '#ef4444';
    
    // Handle actions
    const closeModal = () => {
        backdrop.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => document.body.removeChild(backdrop), 200);
    };
    
    cancelBtn.onclick = () => {
        closeModal();
        if (onCancel) onCancel();
    };
    
    okBtn.onclick = () => {
        closeModal();
        onConfirm();
    };
    
    backdrop.onclick = (e) => {
        if (e.target === backdrop) {
            closeModal();
            if (onCancel) onCancel();
        }
    };
}

// Add CSS animations
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
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
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes scaleIn {
            from {
                transform: scale(0.9);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}
