import React, { useState, useEffect } from 'react';
import { ApiService } from '../../service/api-service';
import type { User } from '../../types/User';
import type { Review } from '../../types/Review';


const reviewApi = new ApiService<Review>('review');
const userApi = new ApiService<User>('user');

const ReviewFeature = () => {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0
  });
  const [filters, setFilters] = useState({
    summary: '',
    rating: '',
    userId: '',
    reviewerId: ''
  });

  // For user/reviewer dropdowns
  const [users, setUsers] = useState<User[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [addForm, setAddForm] = useState({ summary: '', rating: 1, userId: '', reviewerId: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{ id: number | null; summary: string; rating: number; userId: string; reviewerId: string }>({ id: null, summary: '', rating: 1, userId: '', reviewerId: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Fetch users for dropdowns
  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll({ page: 1, limit: 100 });
      setUsers(response?.data as User[]);
    } catch (error) {
      setUsers([]);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewApi.getAll({
        page: pagination.page,
        limit: pagination.limit
      });
      setAllReviews(response?.data as Review[]);
      setPagination(prev => ({ ...prev, total: response.total }));
    } catch (error) {
      setAllReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Local filtering
  useEffect(() => {
    let filtered = allReviews;
    if (filters.summary) {
      filtered = filtered.filter(r =>
        r.summary.toLowerCase().includes(filters.summary.toLowerCase())
      );
    }
    if (filters.rating) {
      filtered = filtered.filter(r => r.rating === Number(filters.rating));
    }
    if (filters.userId) {
      filtered = filtered.filter(r => r.user.id === Number(filters.userId));
    }
    if (filters.reviewerId) {
      filtered = filtered.filter(r => r.reviewer.id === Number(filters.reviewerId));
    }
    setReviews(filtered);
  }, [allReviews, filters]);

  useEffect(() => {
    fetchReviews();
    fetchUsers();
    // eslint-disable-next-line
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
    setAddForm({ summary: '', rating: 1, userId: '', reviewerId: '' });
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

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      await reviewApi.create({
        summary: addForm.summary,
        rating: Number(addForm.rating),
        userId: Number(addForm.userId),
        reviewerId: Number(addForm.reviewerId)
      });
      closeModal();
      fetchReviews();
    } catch (err) {
      setAddError('Failed to add review. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit handlers
  const openEditModal = (review: Review) => {
    setEditForm({
      id: review.id,
      summary: review.summary,
      rating: review.rating,
      userId: String(review.user.id),
      reviewerId: String(review.reviewer.id)
    });
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

  const handleEditReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;
    setEditLoading(true);
    setEditError(null);
    try {
      await reviewApi.update(editForm.id, {
        summary: editForm.summary,
        rating: Number(editForm.rating),
      });
      closeEditModal();
      fetchReviews();
    } catch (err) {
      setEditError('Failed to update review. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewApi.delete(id);
      fetchReviews();
    } catch (err) {
      alert('Failed to delete review. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-black tracking-tight text-center">
        Reviews Management
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={openModal}
          className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
        >
          + Add Review
        </button>
      </div>

      <div className="mb-6 bg-white p-5 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-200">
        <div className="flex flex-col w-full md:w-1/4">
          <label className="block text-xs font-semibold mb-1 text-black">Summary</label>
          <input
            type="text"
            name="summary"
            value={filters.summary}
            onChange={handleFilterChange}
            placeholder="Filter by summary"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/6">
          <label className="block text-xs font-semibold mb-1 text-black">Rating</label>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
          >
            <option value="">All</option>
            {[1,2,3,4,5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="block text-xs font-semibold mb-1 text-black">User</label>
          <select
            name="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
          >
            <option value="">All</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="block text-xs font-semibold mb-1 text-black">Reviewer</label>
          <select
            name="reviewerId"
            value={filters.reviewerId}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
          >
            <option value="">All</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Review Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center text-black font-semibold animate-pulse">Loading reviews...</div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">ID</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">Summary</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">Rating</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">User</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">Reviewer</th>
                  <th className="p-4 text-left text-xs font-bold text-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.map(review => (
                  <tr key={review.id} className="hover:bg-gray-100 transition">
                    <td className="p-4 text-sm text-black">{review.id}</td>
                    <td className="p-4 text-sm text-black">{review.summary}</td>
                    <td className="p-4 text-sm text-black">{review.rating}</td>
                    <td className="p-4 text-sm text-black">{review.user.name}</td>
                    <td className="p-4 text-sm text-black">{review.reviewer.name}</td>
                    <td className="p-4 text-sm text-black flex gap-2">
                      <button
                        onClick={() => openEditModal(review)}
                        className="px-3 py-1 rounded bg-black text-white font-semibold hover:bg-gray-900 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-3 py-1 rounded bg-white border border-black text-black font-semibold hover:bg-gray-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-sm text-gray-400">
                      No reviews found
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

      {/* Add Review Modal */}
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
            <h3 className="text-xl font-bold mb-4 text-black text-center">Add Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Summary</label>
                <input
                  type="text"
                  name="summary"
                  value={addForm.summary}
                  onChange={handleAddFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                  placeholder="Enter summary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Rating</label>
                <select
                  name="rating"
                  value={addForm.rating}
                  onChange={handleAddFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  {[1,2,3,4,5].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">User</label>
                <select
                  name="userId"
                  value={addForm.userId}
                  onChange={handleAddFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Reviewer</label>
                <select
                  name="reviewerId"
                  value={addForm.reviewerId}
                  onChange={handleAddFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  <option value="">Select Reviewer</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
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
                {addLoading ? 'Adding...' : 'Add Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
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
            <h3 className="text-xl font-bold mb-4 text-black text-center">Edit Review</h3>
            <form onSubmit={handleEditReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Summary</label>
                <input
                  type="text"
                  name="summary"
                  value={editForm.summary}
                  onChange={handleEditFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                  placeholder="Enter summary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Rating</label>
                <select
                  name="rating"
                  value={editForm.rating}
                  onChange={handleEditFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  {[1,2,3,4,5].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">User</label>
                <select
                  name="userId"
                  value={editForm.userId}
                  onChange={handleEditFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  <option value="">Select User</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-black">Reviewer</label>
                <select
                  name="reviewerId"
                  value={editForm.reviewerId}
                  onChange={handleEditFormChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black transition text-black bg-white"
                >
                  <option value="">Select Reviewer</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
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

export default ReviewFeature;