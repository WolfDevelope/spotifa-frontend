import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const UserManagement = () => {
  const { adminAPI } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(pagination.page, pagination.limit);
      if (response.success) {
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          ...response.pagination
        }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await adminAPI.updateUserRole(userId, newRole);
      if (response.success) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 text-white';
      case 'artist':
        return 'bg-blue-500 text-white';
      case 'user':
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-white flex flex-col items-center justify-center py-8 space-y-4">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="text-gray-400">
          Total Users: {pagination.total}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#3a2d52] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2d2240]">
              <tr>
                <th className="text-left text-white p-4">User</th>
                <th className="text-left text-white p-4">Email</th>
                <th className="text-left text-white p-4">Role</th>
                <th className="text-left text-white p-4">Joined</th>
                <th className="text-left text-white p-4">Status</th>
                <th className="text-left text-white p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-[#2d2240]">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user.name || 'Unnamed User'}
                        </div>
                        <div className="text-gray-400 text-sm">
                          ID: {user._id.slice(-8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm ${getRoleColor(user.role)} border-none outline-none`}
                    >
                      <option value="user">User</option>
                      <option value="artist">Artist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-gray-300 text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // You can add more detailed user view functionality here
                          console.log('View user details:', user);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => {
            if (pagination.page > 1 && !loading) {
              setPagination(prev => ({ ...prev, page: prev.page - 1 }));
            }
          }}
          disabled={pagination.page === 1 || loading}
          className="px-3 py-1 bg-[#3a2d52] text-white rounded disabled:opacity-50 transition-opacity"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => {
                  if (pageNum !== pagination.page && !loading) {
                    setPagination(prev => ({ ...prev, page: pageNum }));
                  }
                }}
                disabled={loading}
                className={`px-3 py-1 rounded transition-all ${
                  pageNum === pagination.page
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-[#3a2d52] text-white hover:bg-[#4a3d62]'
                } disabled:opacity-50`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => {
            if (pagination.page < pagination.pages && !loading) {
              setPagination(prev => ({ ...prev, page: prev.page + 1 }));
            }
          }}
          disabled={pagination.page === pagination.pages || loading}
          className="px-3 py-1 bg-[#3a2d52] text-white rounded disabled:opacity-50 transition-opacity"
        >
          Next
        </button>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#3a2d52] rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Role Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Users:</span>
              <span className="text-white">
                {users.filter(u => u.role === 'user').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Artists:</span>
              <span className="text-white">
                {users.filter(u => u.role === 'artist').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Admins:</span>
              <span className="text-white">
                {users.filter(u => u.role === 'admin').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#3a2d52] rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Account Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Active:</span>
              <span className="text-green-400">
                {users.filter(u => u.isActive).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inactive:</span>
              <span className="text-red-400">
                {users.filter(u => !u.isActive).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#3a2d52] rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Recent Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">New Today:</span>
              <span className="text-white">
                {users.filter(u => {
                  const today = new Date();
                  const userDate = new Date(u.createdAt);
                  return userDate.toDateString() === today.toDateString();
                }).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">This Week:</span>
              <span className="text-white">
                {users.filter(u => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(u.createdAt) > weekAgo;
                }).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
