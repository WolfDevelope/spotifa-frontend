import { apiRequest } from './api';

const AUTH_API = {
  // Register new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Login user
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Logout user
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    });
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiRequest('/auth/update-me', {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  },

  // Delete user account
  deleteAccount: async () => {
    return apiRequest('/auth/delete-me', {
      method: 'DELETE'
    });
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  // Reset password
  resetPassword: async (token, newPassword, passwordConfirm) => {
    return apiRequest(`/auth/reset-password/${token}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        password: newPassword,
        passwordConfirm 
      })
    });
  },

  // Update password
  updatePassword: async (currentPassword, newPassword, passwordConfirm) => {
    return apiRequest('/auth/update-password', {
      method: 'PATCH',
      body: JSON.stringify({
        currentPassword,
        newPassword,
        passwordConfirm
      })
    });
  },

  // Verify email
  verifyEmail: async (token) => {
    return apiRequest(`/auth/verify-email/${token}`, {
      method: 'GET'
    });
  },

  // Resend verification email
  resendVerificationEmail: async (email) => {
    return apiRequest('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

export default AUTH_API;
