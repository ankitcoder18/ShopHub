import { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiUserCheck, FiUserX } from 'react-icons/fi';
import api from '../utils/api';
import Toast from '../components/Toast';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [activeTab, setActiveTab] = useState('admins'); // 'admins' | 'sellers' | 'users'
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [message, setMessage] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [ordersUser, setOrdersUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, sellersRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/sellers')
            ]);
            setUsers(usersRes.data.users || []);
            setSellers(sellersRes.data.sellers || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleMakeAdmin = async (userId) => {
        if (!window.confirm('Are you sure you want to make this user an admin?')) return;

        try {
            await api.post('/admin/create-admin', { userId });
            showToast('User promoted to admin successfully', 'success');
            fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to create admin', 'error');
        }
    };

    const handleMakeSuperAdmin = async (userId) => {
        if (!window.confirm('Are you sure you want to make this user a super admin? This is a powerful role!')) return;

        try {
            await api.post('/admin/create-superadmin', { userId });
            showToast('User promoted to super admin successfully', 'success');
            fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to create super admin', 'error');
        }
    };

    const handleEditUser = (user) => {
        setEditUser({ ...user });
        setShowEditModal(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/users/${editUser._id}`, {
                name: editUser.name,
                email: editUser.email,
                phone: editUser.phone,
                role: editUser.role
            });
            showToast('User updated successfully', 'success');
            setShowEditModal(false);
            setEditUser(null);
            fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update user', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            showToast('User deleted successfully', 'success');
            fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to delete user', 'error');
        }
    };

    const handleViewActivity = async (userId) => {
        try {
            const { data } = await api.get(`/admin/users/${userId}/activity?limit=50`);
            setActivityLogs(data.logs || []);
            setShowActivityModal(true);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch activity', 'error');
        }
    };

    const handleViewOrders = async (user) => {
        try {
            setOrdersUser(user);
            const { data } = await api.get(`/admin/users/${user._id}/orders?limit=50`);
            setOrders(data.orders || []);
            setShowOrdersModal(true);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to fetch orders', 'error');
        }
    };

    const handleRemoveSeller = async (sellerId) => {
        if (!window.confirm('Are you sure you want to remove seller status? This will revoke their selling privileges.')) return;

        try {
            await api.post('/admin/remove-seller', { userId: sellerId });
            showToast('Seller status removed successfully', 'success');
            fetchData();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to remove seller', 'error');
        }
    };

    const handleOpenMessageModal = (seller) => {
        setSelectedSeller(seller);
        setShowMessageModal(true);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            await api.post(`/admin/message-seller/${selectedSeller._id}`, {
                message: message.trim()
            });

            showToast('Message sent successfully', 'success');
            setShowMessageModal(false);
            setMessage('');
            setSelectedSeller(null);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to send message', 'error');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="user-management-section">
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div className="section-header">
                <h2>User Management</h2>
            </div>

            {/* Tabs */}
            <div className="tabs-header">
                <button
                    className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admins')}
                >
                    <FiShield /> Admins ({users.filter(u => u.role === 'admin' || u.role === 'superadmin').length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'sellers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sellers')}
                >
                    <FiUserCheck /> Sellers ({sellers.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <FiUsers /> Users ({users.length})
                </button>
            </div>

            {/* Admins Tab */}
            {activeTab === 'admins' && (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(u => u.role === 'admin' || u.role === 'superadmin').map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <img
                                                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                                                alt={user.name}
                                                className="user-avatar"
                                            />
                                            <span className="user-name">{user.name}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role === 'superadmin' && <FiShield />}
                                            {user.role === 'admin' && <FiShield />}
                                            {user.role === 'seller' && <FiUserCheck />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {user.role === 'user' && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleMakeAdmin(user._id)}
                                                    >
                                                        Make Admin
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => handleMakeSuperAdmin(user._id)}
                                                    >
                                                        Make Super Admin
                                                    </button>
                                                </>
                                            )}
                                            {user.role === 'admin' && (
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleMakeSuperAdmin(user._id)}
                                                >
                                                    Make Super Admin
                                                </button>
                                            )}
                                            {(user.role === 'superadmin' || user.role === 'admin') && (
                                                <span className="text-muted">No actions</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Sellers Tab */}
            {activeTab === 'sellers' && (
                <div className="sellers-grid">
                    {sellers.length === 0 ? (
                        <div className="empty-state">
                            <FiUserCheck size={48} />
                            <p>No approved sellers yet</p>
                        </div>
                    ) : (
                        sellers.map((seller) => (
                            <div key={seller._id} className="seller-card">
                                <div className="seller-header">
                                    <img
                                        src={seller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&background=10b981&color=fff`}
                                        alt={seller.name}
                                        className="seller-avatar"
                                    />
                                    <div>
                                        <h3>{seller.name}</h3>
                                        <p className="seller-email">{seller.email}</p>
                                    </div>
                                </div>
                                <div className="seller-details">
                                    <div className="detail-row">
                                        <span className="label">Business:</span>
                                        <span className="value">{seller.sellerInfo?.businessName || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">GST:</span>
                                        <span className="value">{seller.sellerInfo?.gstNumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Approved:</span>
                                        <span className="value">
                                            {seller.sellerInfo?.approvedAt
                                                ? new Date(seller.sellerInfo.approvedAt).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="seller-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleOpenMessageModal(seller)}
                                    >
                                        💬 Message Seller
                                    </button>
                                    <button
                                        className="btn btn-error btn-sm"
                                        onClick={() => handleRemoveSeller(seller._id)}
                                    >
                                        ❌ Remove Seller
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        <div className="user-cell">
                                            <img
                                                src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=10b981&color=fff`}
                                                alt={u.name}
                                                className="user-avatar"
                                            />
                                            <span className="user-name">{u.name}</span>
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || 'N/A'}</td>
                                    <td>
                                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn btn-sm btn-secondary" onClick={() => handleViewActivity(u._id)}>Activity</button>
                                            <button className="btn btn-sm btn-secondary" onClick={() => handleViewOrders(u)}>Orders</button>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleEditUser(u)}>Edit</button>
                                            <button className="btn btn-sm btn-error" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>)
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Message Modal */}
            {showMessageModal && selectedSeller && (
                <div className="modal-overlay" onClick={() => {
                    setShowMessageModal(false);
                    setSelectedSeller(null);
                    setMessage('');
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Send Message to {selectedSeller.name}</h2>
                            <button className="modal-close" onClick={() => {
                                setShowMessageModal(false);
                                setSelectedSeller(null);
                                setMessage('');
                            }}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSendMessage}>
                                <div className="form-group">
                                    <label className="form-label">Your Message</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="Type your message to the seller..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Send Message
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowMessageModal(false);
                                            setSelectedSeller(null);
                                            setMessage('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && editUser && (
                <div className="modal-overlay" onClick={() => { setShowEditModal(false); setEditUser(null); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button className="modal-close" onClick={() => { setShowEditModal(false); setEditUser(null); }}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSaveUser}>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input className="form-control" value={editUser.name || ''} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input className="form-control" value={editUser.email || ''} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input className="form-control" value={editUser.phone || ''} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select className="form-control" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}>
                                        <option value="user">user</option>
                                        <option value="seller">seller</option>
                                        <option value="admin">admin</option>
                                        <option value="superadmin">superadmin</option>
                                    </select>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">Save</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowEditModal(false); setEditUser(null); }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Modal */}
            {showActivityModal && (
                <div className="modal-overlay" onClick={() => { setShowActivityModal(false); setActivityLogs([]); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Activity</h2>
                            <button className="modal-close" onClick={() => { setShowActivityModal(false); setActivityLogs([]); }}>×</button>
                        </div>
                        <div className="modal-body">
                            {activityLogs.length === 0 ? (
                                <p>No recent activity</p>
                            ) : (
                                <div className="activity-list">
                                    {activityLogs.map((log) => (
                                        <div key={log._id} className="activity-item">
                                            <div className="activity-line">
                                                <span className="pill">{log.method}</span>
                                                <code className="path">{log.path}</code>
                                            </div>
                                            <div className="activity-meta">
                                                <span>{new Date(log.createdAt).toLocaleString()}</span>
                                                <span>• {log.statusCode}</span>
                                                {log.meta?.durationMs !== undefined && <span>• {log.meta.durationMs}ms</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Modal */}
            {showOrdersModal && (
                <div className="modal-overlay" onClick={() => { setShowOrdersModal(false); setOrders([]); setOrdersUser(null); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Orders - {ordersUser?.name}</h2>
                            <button className="modal-close" onClick={() => { setShowOrdersModal(false); setOrders([]); setOrdersUser(null); }}>×</button>
                        </div>
                        <div className="modal-body">
                            {orders.length === 0 ? (
                                <p>No orders found</p>
                            ) : (
                                <div className="orders-list">
                                    {orders.map((o) => (
                                        <div key={o._id} className="order-item">
                                            <div className="order-line">
                                                <span className="pill">{o.orderStatus}</span>
                                                <span className="order-number">{o.orderNumber}</span>
                                                <span className="price">₹{o.totalPrice}</span>
                                            </div>
                                            <div className="order-meta">
                                                <span>Placed: {new Date(o.createdAt).toLocaleString()}</span>
                                                {o.deliveredAt && <span>• Delivered: {new Date(o.deliveredAt).toLocaleString()}</span>}
                                                {!o.deliveredAt && o.expectedDeliveryDate && <span>• ETA: {new Date(o.expectedDeliveryDate).toLocaleDateString()}</span>}
                                            </div>
                                            <div className="order-meta">
                                                <span>Seller: {o.seller?.sellerInfo?.businessName || o.seller?.name || 'N/A'}</span>
                                                <span>• Payment: {o.paymentMethod} ({o.paymentStatus})</span>
                                                <span>• Items: {o.items?.length || 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

