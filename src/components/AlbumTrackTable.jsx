import React, { useState } from 'react';
import HeartIcon from './HeartIcon';

const AlbumTrackTable = ({ tracks, album, artist }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginModal(true);
    }
    // The HeartIcon component will handle the rest
  };

  return (
    <>
      <section className="bg-gradient-to-br from-[#8BCBE700] to-[#1171E2] rounded-xl shadow-lg max-w-5xl mx-auto overflow-x-auto mb-10">
        <table className="min-w-full text-sm text-left text-white">
          <thead>
            <tr className="border-b border-gray-700 text-base">
              <th className="px-3 py-3"></th>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Title</th>
              <th className="px-3 py-3">Release Date</th>
              <th className="px-3 py-3">Album</th>
              <th className="px-3 py-3 text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((track, idx) => (
              <tr key={track.id} className="border-b border-gray-700 hover:bg-[#23203a]">
                <td className="px-3 py-2">
                  <div className="w-12 h-12 bg-gray-700 rounded">
                    <img src={track.cover} alt="" className="w-full h-full object-cover rounded" />
                  </div>
                </td>
                <td className="px-3 py-2 font-bold">{idx + 1}</td>
                <td className="px-3 py-2 font-semibold">
                  {track.title}
                  <div className="text-xs text-gray-300 font-normal">{artist ? artist.name : ""}</div>
                </td>
                <td className="px-3 py-2">{track.releaseDate || ""}</td>
                <td className="px-3 py-2">{album.name}</td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-4 h-full">
                    <div onClick={handleFavoriteClick}>
                      <HeartIcon songId={track.id} size={20} />
                    </div>
                    <span>{track.duration}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2d2240] p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Login Required</h3>
            <p className="mb-4">Please login to add songs to your favorites.</p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumTrackTable;