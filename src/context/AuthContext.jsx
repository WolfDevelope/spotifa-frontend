// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AUTH_API from '../services/auth';
import { useUserNotification } from '../hooks/useUserNotification';
import UserNotificationModal from '../components/UserNotificationModal';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // User notification modal
  const {
    showNotification,
    setShowNotification,
    notificationData,
    showSuccess,
    showError,
    showInfo
  } = useUserNotification();

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
      showSuccess('Registration successful! Please check your email to verify your account.', 'Registration Complete');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      showError(errorMessage, 'Registration Failed');
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
      
      showSuccess('Welcome back! You have been logged in successfully.', 'Login Successful');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      showError(errorMessage, 'Login Failed');
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
      showInfo('You have been logged out successfully. See you again!', 'Logged Out');
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
      showSuccess('Your profile has been updated successfully!', 'Profile Updated');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      showError(errorMessage, 'Update Failed');
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
      showSuccess('Your account has been deleted successfully. We\'re sad to see you go!', 'Account Deleted');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete account';
      showError(errorMessage, 'Deletion Failed');
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await AUTH_API.forgotPassword(email);
      showInfo('Password reset instructions have been sent to your email. Please check your inbox.', 'Reset Email Sent');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send password reset email';
      showError(errorMessage, 'Reset Failed');
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword, passwordConfirm) => {
    try {
      await AUTH_API.resetPassword(token, newPassword, passwordConfirm);
      showSuccess('Password reset successful! You can now log in with your new password.', 'Password Reset Complete');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password';
      showError(errorMessage, 'Reset Failed');
      return { success: false, error: errorMessage };
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    try {
      await AUTH_API.resendVerificationEmail(email);
      showInfo('Verification email sent! Please check your inbox and follow the instructions.', 'Verification Email Sent');
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to resend verification email';
      showError(errorMessage, 'Resend Failed');
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
      
      {/* User Notification Modal */}
      <UserNotificationModal
        showModal={showNotification}
        setShowModal={setShowNotification}
        title={notificationData.title}
        message={notificationData.message}
        type={notificationData.type}
        autoClose={true}
        autoCloseDelay={4000}
      />
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
