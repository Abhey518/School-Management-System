// Authentication Middleware
// Include this file in all protected pages (admin and teacher portals)

async function checkAuthentication(requiredRole) {
    const supabase = getSupabaseClient();
    
    try {
        // Check if user has a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            // No valid session, redirect to login
            redirectToLogin();
            return false;
        }
        
        // Check user role
        const { data: userRole, error: roleError } = await supabase
            .from('user_roles')
            .select('role, teacher_id')
            .eq('user_id', session.user.id)
            .single();
        
        if (roleError || !userRole) {
            console.error('Error fetching user role:', roleError);
            await supabase.auth.signOut();
            redirectToLogin();
            return false;
        }
        
        // Check if user has required role
        if (requiredRole && userRole.role !== requiredRole) {
            alert('Access denied. You do not have permission to access this page.');
            redirectToLogin();
            return false;
        }
        
        // Store user info in localStorage for easy access
        localStorage.setItem('userId', session.user.id);
        localStorage.setItem('userEmail', session.user.email);
        localStorage.setItem('userRole', userRole.role);
        
        if (userRole.role === 'teacher' && userRole.teacher_id) {
            localStorage.setItem('teacherId', userRole.teacher_id);
        }
        
        return true;
        
    } catch (error) {
        console.error('Authentication error:', error);
        redirectToLogin();
        return false;
    }
}

function redirectToLogin() {
    // Clear any stored session data
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('teacherId');
    
    // Redirect to login page
    window.location.href = '../index.html';
}

async function logout() {
    const supabase = getSupabaseClient();
    
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        redirectToLogin();
    }
}

// Get current user info from localStorage
function getCurrentUser() {
    return {
        id: localStorage.getItem('userId'),
        email: localStorage.getItem('userEmail'),
        role: localStorage.getItem('userRole'),
        teacherId: localStorage.getItem('teacherId')
    };
}

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('userId');
}
