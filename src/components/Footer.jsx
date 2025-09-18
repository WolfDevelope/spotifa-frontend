import React from 'react';

const Footer = () => (
  <footer className="bg-[#432f3c] w-full p-10 text-white mt-8 text-base">
    <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-start gap-8">
      {/* About */}
      <div className="flex-1 min-w-[260px] max-w-[350px]">
        <h2 className="text-3xl font-extrabold mb-2">About</h2>
        <p className="font-semibold mb-2 text-gray-100">
          Melodies is a website that has been created for over 
          <span className="text-pink-400"> 5 year's </span>
          now and it is one of the most famous music player website’s in the world. in this website you can listen and download songs for free. also of you want no limitation you can buy our 
          <a className="text-sky-400 underline font-bold" href="#">premium pass's.</a>
        </p>
      </div>
      {/* Melodi */}
      <div className="flex-1 min-w-[150px]">
        <h3 className="text-2xl font-extrabold mb-1 border-b-2 border-white w-fit pb-1">Melodi</h3>
        <ul className="mt-2 space-y-1 font-bold">
          <li>Songs</li>
          <li>Radio</li>
          <li>Podcast</li>
        </ul>
      </div>
      {/* Access */}
      <div className="flex-1 min-w-[180px]">
        <h3 className="text-2xl font-extrabold mb-1 border-b-2 border-white w-fit pb-1">Access</h3>
        <ul className="mt-2 space-y-1 font-bold">
          <li>Explor</li>
          <li>Artists</li>
          <li>Playlists</li>
          <li>Albums</li>
          <li>Trending</li>
        </ul>
      </div>
      {/* Contact */}
      <div className="flex-1 min-w-[180px]">
        <h3 className="text-2xl font-extrabold mb-1 border-b-2 border-white w-fit pb-1">Contact</h3>
        <ul className="mt-2 space-y-1 font-bold">
          <li>About</li>
          <li>Policy</li>
          <li>Social Media</li>
          <li>Soppurt</li>
        </ul>
      </div>
      {/* Logo & Social */}
      <div className="flex flex-col justify-between">
        <div className="flex items-center min-w-[160px]">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-sky-400 bg-clip-text text-transparent">Melodies</span>
        </div>
        <div className="flex gap-3 mt-4 text-2xl">
          {/* Thay đường dẫn src bằng đúng vị trí file ảnh của bạn */}
          <img src="/assets/images/fluent_call-28-regular.png" className="inline-block w-8 h-8 flex items-center justify-center" alt="Call" />
          <img src="/assets/images/Group.png" className="inline-block w-8 h-8 flex items-center justify-center" alt="Group" />
          <img src="/assets/images/streamline_computer-logo-twitter-media-twitter-social.png" className="inline-block w-8 h-8 flex items-center justify-center" alt="Twitter" />
          <img src="/assets/images/Vector.png" className="inline-block w-8 h-8 flex items-center justify-center" alt="Vector" />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;