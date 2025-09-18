import React from 'react';
import { Link } from 'react-router-dom';
const JoinPlatform = () => (
  <section className="mb-8 flex gap-2 items-center justify-between">
    <div className="w-3/5">
      <h2 className="text-3xl font-extrabold text-white mb-3">Join Our Platform</h2>
      <p className="text-lg font-bold text-white mb-6">
        You can be one of the <span className="text-pink-400">members</span> of our platform by just adding some necessarily information. If you already have an account on our website, you can just hit the{' '}
        <Link to="/login" className="cursor-pointer text-sky-400 underline font-bold">Login button.</Link>
      </p>
    </div>
    <div className="flex gap-4 min-w-[500px] justify-end">
      <Link to="/signup">
        <button className="cursor-pointer flex-1 px-0 py-0 h-16 w-60 rounded-xl text-2xl font-bold text-white bg-pink-500 hover:bg-pink-600 transition-all outline-none focus:ring-2 focus:ring-pink-400">
          Sign Up
        </button>
      </Link>
      <Link to="/login">
        <button className="cursor-pointer flex-1 px-0 py-0 h-16 w-60 rounded-xl text-2xl font-bold text-pink-400 bg-[#232025] hover:text-pink-200 transition-all">
          Login
        </button>
      </Link>
    </div>
  </section>
);

export default JoinPlatform;