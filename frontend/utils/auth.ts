export const logout = () => {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');

    // Redirect to login page
    window.location.href = '/';
}; 