// Supabase Client Configuration
// Replace these values with your actual Supabase project credentials

const SUPABASE_URL = 'https://dlzdovrnoztajxgexyxk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsemRvdnJub3p0YWp4Z2V4eXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDY4NDgsImV4cCI6MjA3OTgyMjg0OH0.sLfuQ7qEjho6klVnG-5tMzBTzk9wDsGdBvjleGshcWg';

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
