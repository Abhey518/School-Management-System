/**
 * Loading Spinner Utility
 * Provides functions to show/hide loading indicators
 */

// Show full-page loading overlay
function showLoading(message = 'Loading...') {
    // Remove existing overlay if any
    hideLoading();
    
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="spinner-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Hide full-page loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Show loading spinner in a button
function showButtonLoading(buttonElement) {
    if (!buttonElement) return;
    
    buttonElement.disabled = true;
    buttonElement.classList.add('btn-loading');
    buttonElement.dataset.originalText = buttonElement.innerHTML;
}

// Hide loading spinner from a button
function hideButtonLoading(buttonElement) {
    if (!buttonElement) return;
    
    buttonElement.disabled = false;
    buttonElement.classList.remove('btn-loading');
    if (buttonElement.dataset.originalText) {
        buttonElement.innerHTML = buttonElement.dataset.originalText;
        delete buttonElement.dataset.originalText;
    }
}

// Show inline spinner in a container
function showInlineLoading(containerElement, message = 'Loading...') {
    if (!containerElement) return;
    
    containerElement.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading-spinner loading-spinner-large" style="margin: 0 auto 1rem;"></div>
            <p style="color: #666;">${message}</p>
        </div>
    `;
}

// Async wrapper that shows loading during operation
async function withLoading(asyncFunction, message = 'Processing...') {
    showLoading(message);
    try {
        const result = await asyncFunction();
        return result;
    } finally {
        hideLoading();
    }
}

// Button click wrapper that shows loading on button
async function withButtonLoading(buttonElement, asyncFunction) {
    showButtonLoading(buttonElement);
    try {
        const result = await asyncFunction();
        return result;
    } finally {
        hideButtonLoading(buttonElement);
    }
}
