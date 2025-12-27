import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Wrench, ClipboardList, Shield, UserPlus, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const { user, createUser } = useAuth();
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: 'USER'
    });

    const stats = [
        { title: 'Total Users', value: 12, icon: Users, gradient: 'from-blue-500 to-blue-700' },
        { title: 'Equipment', value: 47, icon: Wrench, gradient: 'from-green-500 to-emerald-600' },
        { title: 'Active Requests', value: 23, icon: ClipboardList, gradient: 'from-amber-500 to-orange-600' },
        { title: 'Teams', value: 4, icon: Shield, gradient: 'from-purple-500 to-purple-700' }
    ];

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await createUser(formData);
            toast.success('User created successfully');
            setShowCreateUser(false);
            setFormData({ username: '', password: '', fullName: '', email: '', role: 'USER' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.fullName}</p>
                </div>
                <button
                    onClick={() => setShowCreateUser(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Create User
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`stat-card bg-gradient-to-br ${stat.gradient}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">{stat.title}</p>
                                <p className="text-4xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                            <Users className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                        </button>
                        <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                            <Shield className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Manage Teams</p>
                        </button>
                        <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                            <Wrench className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Equipment</p>
                        </button>
                        <button className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                            <Settings className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">System Status</span>
                            <span className="badge bg-green-100 text-green-700">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">Database</span>
                            <span className="badge bg-green-100 text-green-700">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">Active Sessions</span>
                            <span className="font-medium text-gray-900 dark:text-white">3</span>
                        </div>
                    </div>
                </div>
            </div>

            {showCreateUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="TECHNICIAN">Technician</option>
                                    <option value="USER">User</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateUser(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    Create User
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
