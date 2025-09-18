// components/LoginModal.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginModal = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://mindx-mockup-server.vercel.app/api/resources/Melodies%20Web%20Accounts?apiKey=6852b3cd6df26a3a2bf435cd`
      );
      const responseData = await res.json();
      const users = responseData?.data?.data;

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
        onClose(); // Đóng modal khi login thành công
      } else {
        alert('Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      console.error('Lỗi:', err);
      alert('Không thể kết nối máy chủ');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center px-4">
      <div className="relative bg-[#39243a]/90 w-full max-w-[420px] rounded-2xl shadow-xl p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-pink-400"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src="/assets/images/melodieslogo.png"
            alt="Melodies Logo"
            className="w-20 h-20 mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Login To Continue
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            placeholder="E-Mail"
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-pink-400"
                onClick={() => setShowPwd((v) => !v)}
                title={showPwd ? "Hide password" : "Show password"}
              >
                {/* Eye Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showPwd ? (
                    // Eye off icon
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.657 0 3.22.408 4.583 1.125M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  ) : (
                    // Eye icon
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0 5 9 5 9 0s-9-5-9 0z"
                    />
                  )}
                </svg>
              </span>
          </div>
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        {/* Sign up */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-white text-sm">Don't have an account?</span>
          <Link to="/signup" className="text-sky-400 hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
