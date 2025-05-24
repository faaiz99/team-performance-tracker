import React, { useState, useEffect } from 'react';
import { ApiService } from '../../service/api-service';
type User = {
  id: number;
  name: string;
  role: 'employee' | 'manager' | 'hr';
};

const userApi = new ApiService<User>('user');

const UserFeature = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0
  });
  const [filters, setFilters] = useState({
    name: '',
    role: ''
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', role: 'employee' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{ id: number | null; name: string; role: string }>({ id: null, name: '', role: 'employee' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAll({
        page: pagination.page,
        limit: pagination.limit
      });
      setAllUsers(response?.data as User[]);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = allUsers;
    if (filters.name) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    setUsers(filtered);
  }, [allUsers, filters]);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Modal handlers
  const openModal = () => {
    setAddForm({ name: '', role: 'employee' });
    setAddError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setAddError(null);
  };

  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await userApi.create(addForm);
      closeModal();
      fetchUsers();
    } catch (err) {
      setAddError('Failed to add user. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit handlers
  const openEditModal = (user: User) => {
    setEditForm({ id: user.id, name: user.name, role: user.role });
    setEditError(null);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditError(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await userApi.update(editForm.id, { name: editForm.name, role: editForm.role });
      closeEditModal();
      fetchUsers();
    } catch (err) {
      setEditError('Failed to update user. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete handler
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userApi.delete(id);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-black tracking-tight text-center">
        User Management
      </h2>

      {/* Add User Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openModal}
          className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          + Add User
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-200">
        <div className="flex flex-col w-full md:w-1/2">
          <label className="block text-xs font-semibold mb-1 text-black">Name</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Filter by name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/3">
          <label className="block text-xs font-semibold mb-1 text-black">Role</label>
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
          >
            <option value="">All Roles</option>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="hr">HR</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-black font-semibold animate-pulse">Loading users...</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">ID</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">Name</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">Role</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-100 transition">
                    <td className="p-4 text-sm text-black">{user.id}</td>
                    <td className="p-4 text-sm text-black">{user.name}</td>
                    <td className="p-4 text-sm capitalize text-black">{user.role}</td>
                    <td className="p-4 text-sm text-black flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="px-3 py-1 rounded bg-black text-white font-semibold hover:bg-gray-900 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 rounded bg-white border border-black text-black font-semibold hover:bg-gray-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-sm text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-4 border-t bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-2">
              <span className="text-xs text-black font-medium">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit) || 1}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    pagination.page === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    pagination.page >= Math.ceil(pagination.total / pagination.limit)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
            <button
              className="absolute top-3 right-3 text-black text-xl font-bold hover:text-gray-600"
              onClick={closeModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-black text-center">Add User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Name</label>
                <input
                  type="text"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Role</label>
                <select
                  name="role"
                  value={addForm.role}
                  onChange={handleAddFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                </select>
              </div>
              {addError && (
                <div className="text-red-600 text-xs">{addError}</div>
              )}
              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                {addLoading ? 'Adding...' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
            <button
              className="absolute top-3 right-3 text-black text-xl font-bold hover:text-gray-600"
              onClick={closeEditModal}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-black text-center">Edit User</h3>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Role</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR</option>
                </select>
              </div>
              {editError && (
                <div className="text-red-600 text-xs">{editError}</div>
              )}
              <button
                type="submit"
                disabled={editLoading}
                className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFeature;