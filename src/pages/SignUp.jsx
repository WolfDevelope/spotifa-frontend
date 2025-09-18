import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../services/api';

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveUserToAPI = async (userData) => {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          passwordConfirm: userData.password
        }),
      });
  
      if (response && response.success) {
        navigate('/login', { 
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập.' 
          } 
        });
        return { success: true };
      } else {
        let errorMessage = response?.message || 'Đã xảy ra lỗi khi đăng ký';
        if (errorMessage.includes('already exists')) {
          errorMessage = 'Email hoặc tên đăng nhập đã được sử dụng';
        }
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('API Error:', error);
      return { 
        success: false, 
        message: error.message || 'Không thể kết nối đến máy chủ' 
      };
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    // Basic validation
    if (!form.name.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }
  
    if (!form.email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }
  
    if (form.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
  
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const result = await saveUserToAPI({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
  
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white ml-[16rem]">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-40 flex items-center gap-2 bg-[#2d2240] hover:bg-pink-400 text-white px-4 py-2 rounded-lg shadow transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-[460px] bg-[#39243a]/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center relative">
          <img src="/assets/images/melodieslogo.png" alt="Melodies Logo" className="w-20 h-24 mb-8" />
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Sign Up To Continue</h2>
          
          {error && (
            <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-4 px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="E-Mail"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-4 px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <div className="relative w-full mb-4">
              <input
                name="password"
                type="password"
                placeholder="Password (tối thiểu 8 ký tự)"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
                minLength="8"
              />
            </div>
            <div className="relative w-full mb-6">
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                required
                minLength="6"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mb-6 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Sign Up'}
            </button>
            <div className="text-center text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;