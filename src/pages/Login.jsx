import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../assets/styles/Login.css';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [fromPath, setFromPath] = useState('/');
 // Khi component mount, lưu fromPath nếu có
 useEffect(() => {
  if (location.state?.from?.pathname) {
    setFromPath(location.state.from.pathname);
  }
}, [location.state]);
const handleBack = () => {
  if (window.history.length > 1) {
    window.history.back(); // nếu có thể, quay về trang trước trong stack
  } else {
    navigate(fromPath); // nếu không có stack, fallback về fromPath đã lưu (hoặc '/')
  }
};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

 // Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password) return;

  const result = await login(email, password);
  if (result.success) {
    navigate(fromPath, { replace: true });
  } else {
    // error đã được set và toast ở context, có thể hiển thị thêm nếu muốn
  }
};
  
  
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f] flex items-center justify-center relative font-sans ml-[16rem]">
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-6 left-6 z-40 flex items-center gap-2 bg-[#2d2240] hover:bg-pink-400 text-white px-4 py-2 rounded-lg shadow transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Back</span>
      </button>
      {/* Login Form Card */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-[420px] bg-[#39243a]/80 rounded-2xl shadow-2xl p-10 flex flex-col items-center">
          {/* Logo */}
          <img
            src="/assets/images/melodieslogo.png"
            alt="Melodies Logo"
            className="w-20 h-25 mb-20"
          />
          {/* Login Title */}
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Login To Continue
          </h2>
          <form
            className="w-full flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            {/* Email Input */}
            <input
              id="loginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Mail"
              className="w-full mb-4 px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            {/* Password Input */}
            <div className="w-full mb-2 relative">
              <input
                id="loginPassword"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-5 py-3 rounded-lg bg-[#61235f]/60 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 appearance-none"
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
            <div className="w-full flex justify-between items-center mb-6">
              <a
                href="#"
                className="text-white text-sm font-semibold hover:underline flex items-center gap-1"
              >
                Forgot password
                <svg
                  className="w-4 h-4 inline"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </a>
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-2 rounded-lg transition shadow"
              >
                Login
              </button>
            </div>
          </form>
          {/* Social login buttons */}
          <div className="flex w-full gap-4 mb-8">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-white hover:bg-gray-700 transition"
            >
              <img
                src="/assets/images/google.png"
                alt="Google"
                className="w-5 h-5"
              />{" "}
              Google Login
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-white hover:bg-gray-700 transition"
            >
              <img
                src="/assets/images/facebook.png"
                alt="Facebook"
                className="w-5 h-5"
              />{" "}
              Facebook Login
            </button>
          </div>
          {/* Sign up */}
          <div className="flex flex-row items-center justify-between w-full mt-2">
            <div className="flex flex-col items-start">
              <span className="text-white text-lg font-bold leading-tight">
                Don't Have An Account
              </span>
              <span className="text-white text-base">Sign Up Here</span>
            </div>
            <Link to="/signup">
              <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition px-6 py-2 text-lg whitespace-nowrap">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;