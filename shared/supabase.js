// Supabase Client Configuration
// Credentials are loaded from supabase.config.js (not committed to Git)
// See supabase.config.example.js for setup instructions

// This will be loaded from supabase.config.js via script tag in HTML
// Make sure to include: <script src="shared/supabase.config.js"></script> before this file

// Check if Supabase library is loaded
if (typeof window !== 'undefined' && !window.supabase) {
    console.warn('Supabase library not loaded. Please include it in your HTML:');
    console.warn('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
}

// Initialize Supabase client
let supabaseClient = null;

function initSupabase() {
    if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized successfully');
            return supabaseClient;
        } catch (error) {
            console.error('Error initializing Supabase:', error);
            return null;
        }
    } else {
        console.error('Supabase library not available');
        return null;
    }
}

// Get or initialize the Supabase client
function getSupabaseClient() {
    if (!supabaseClient) {
        supabaseClient = initSupabase();
    }
    return supabaseClient;
}


// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSupabaseClient, initSupabase };
}
