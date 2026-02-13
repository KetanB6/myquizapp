export const apiRequest = async (endpoint, options = {}) => {
if (response.status === 401) {
    // 1. Clear the local data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Redirect to login immediately
    window.location.href = '/login'; 
    return;
  }return response;
};