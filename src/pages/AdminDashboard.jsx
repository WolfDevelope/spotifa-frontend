import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import SongManagement from '../components/admin/SongManagement';
import ArtistManagement from '../components/admin/ArtistManagement';
import AlbumManagement from '../components/admin/AlbumManagement';
import UserManagement from '../components/admin/UserManagement';

const AdminDashboard = () => {
  const { isAdmin, loading, adminAPI } = useAdmin();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
    }
  }, [isAdmin]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1625]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'songs', name: 'Songs', icon: '🎵' },
    { id: 'artists', name: 'Artists', icon: '👨‍🎤' },
    { id: 'albums', name: 'Albums', icon: '💿' },
    { id: 'users', name: 'Users', icon: '👥' }
  ];

  const StatCard = ({ title, value, icon, color = 'bg-gradient-to-r from-purple-500 to-pink-500' }) => (
    <div className={`${color} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
      
      {loadingStats ? (
        <div className="text-white">Loading statistics...</div>
      ) : stats ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Songs"
              value={stats.stats.songs}
              icon="🎵"
              color="bg-gradient-to-r from-blue-500 to-purple-600"
            />
            <StatCard
              title="Total Artists"
              value={stats.stats.artists}
              icon="👨‍🎤"
              color="bg-gradient-to-r from-green-500 to-teal-600"
            />
            <StatCard
              title="Total Albums"
              value={stats.stats.albums}
              icon="💿"
              color="bg-gradient-to-r from-orange-500 to-red-600"
            />
            <StatCard
              title="Total Users"
              value={stats.stats.users}
              icon="👥"
              color="bg-gradient-to-r from-purple-500 to-pink-600"
            />
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Songs */}
            <div className="bg-[#2d2240] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Songs</h3>
              <div className="space-y-3">
                {stats.recentActivities.songs.map((song) => (
                  <div key={song._id} className="flex items-center space-x-3 p-3 bg-[#3a2d52] rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">🎵</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.artist?.name || 'Unknown Artist'}</p>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(song.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-[#2d2240] rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Users</h3>
              <div className="space-y-3">
                {stats.recentActivities.users.map((user) => (
                  <div key={user._id} className="flex items-center space-x-3 p-3 bg-[#3a2d52] rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{user.name || 'Unnamed User'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-500 text-white' :
                        user.role === 'artist' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-gray-400 text-xs mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-white">Error loading statistics</div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'songs':
        return <SongManagement />;
      case 'artists':
        return <ArtistManagement />;
      case 'albums':
        return <AlbumManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f] text-white">
      <main className="flex-1 px-8 py-6" style={{ marginLeft: '16rem' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Welcome back, {currentUser.name || currentUser.email}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#2d2240] rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#3a2d52]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#2d2240] rounded-lg p-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
