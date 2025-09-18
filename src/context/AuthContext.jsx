// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AUTH_API from '../services/auth';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await AUTH_API.getCurrentUser();
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      const data = await AUTH_API.register(userData);
      toast.success('Registration successful! Please check your email to verify your account.');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const { token, user } = await AUTH_API.login(email, password);
      
      // Store token in local storage
      localStorage.setItem('token', token);
      setCurrentUser(user);
      
      toast.success('Logged in successfully!');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await AUTH_API.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth state
      localStorage.removeItem('token');
      setCurrentUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      await AUTH_API.updateProfile(userData);
      // Fetch user mới nhất từ backend để đồng bộ
      const freshUser = await AUTH_API.getCurrentUser();
      setCurrentUser(freshUser.data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      await AUTH_API.deleteAccount();
      // Clear all auth state
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      toast.success('Account deleted successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete account';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await AUTH_API.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send password reset email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword, passwordConfirm) => {
    try {
      await AUTH_API.resetPassword(token, newPassword, passwordConfirm);
      toast.success('Password reset successful! You can now log in with your new password.');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    try {
      await AUTH_API.resendVerificationEmail(email);
      toast.success('Verification email sent! Please check your inbox.');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to resend verification email';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isArtist: currentUser?.role === 'artist'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
