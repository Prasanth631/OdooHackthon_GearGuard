import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Wrench, ClipboardList, Shield, UserPlus, Settings, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function AdminDashboard() {
    const { user, createUser } = useAuth();
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const stats = [
        { title: 'Total Users', value: 12, icon: Users, gradient: 'from-blue-500 to-blue-700' },
        { title: 'Equipment', value: 47, icon: Wrench, gradient: 'from-green-500 to-emerald-600' },
        { title: 'Active Requests', value: 23, icon: ClipboardList, gradient: 'from-amber-500 to-orange-600' },
        { title: 'Teams', value: 4, icon: Shield, gradient: 'from-purple-500 to-purple-700' }
    ];

    const validateField = (name, value) => {
        switch (name) {
            case 'fullName':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            case 'email':
                if (!value.trim()) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const validateForm = () => {
        const newErrors = {
            fullName: validateField('fullName', formData.fullName),
            email: validateField('email', formData.email),
            password: validateField('password', formData.password)
        };
        setErrors(newErrors);
        setTouched({ fullName: true, email: true, password: true });
        return !Object.values(newErrors).some(error => error);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await createUser({
                ...formData,
                username: formData.email.split('@')[0]
            });
            toast.success('User created successfully');
            setShowCreateUser(false);
            setFormData({ fullName: '', email: '', password: '', role: 'USER' });
            setErrors({});
            setTouched({});
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowCreateUser(false);
        setFormData({ fullName: '', email: '', password: '', role: 'USER' });
        setErrors({});
        setTouched({});
        setShowPassword(false);
    };

    const getInputClass = (fieldName) => {
        const base = "input-field";
        if (touched[fieldName] && errors[fieldName]) return `${base} border-red-500 focus:ring-red-500`;
        if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) return `${base} border-green-500 focus:ring-green-500`;
        return base;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Welcome back, {user?.fullName}</p>
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
                        <button className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                            <Users className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
                        </button>
                        <button className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                            <Shield className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Manage Teams</p>
                        </button>
                        <button className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                            <Wrench className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Equipment</p>
                        </button>
                        <button className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left">
                            <Settings className="w-6 h-6 text-primary-600 mb-2" />
                            <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                            <span className="text-gray-600 dark:text-slate-300">System Status</span>
                            <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                            <span className="text-gray-600 dark:text-slate-300">Database</span>
                            <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Connected</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                            <span className="text-gray-600 dark:text-slate-300">Active Sessions</span>
                            <span className="font-medium text-gray-900 dark:text-white">3</span>
                        </div>
                    </div>
                </div>
            </div>

            {showCreateUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleCloseModal}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4" autoComplete="off">
                            <div>
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClass('fullName')}
                                    placeholder="John Doe"
                                    autoComplete="name"
                                />
                                {touched.fullName && errors.fullName && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.fullName}
                                    </p>
                                )}
                                {touched.fullName && !errors.fullName && formData.fullName && (
                                    <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> Looks good
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={getInputClass('email')}
                                    placeholder="user@example.com"
                                    autoComplete="email"
                                />
                                {touched.email && errors.email && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.email}
                                    </p>
                                )}
                                {touched.email && !errors.email && formData.email && (
                                    <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> Valid email
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`${getInputClass('password')} pr-10`}
                                        placeholder="Min 6 characters"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {touched.password && errors.password && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {errors.password}
                                    </p>
                                )}
                                {touched.password && !errors.password && formData.password && (
                                    <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> Strong password
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="TECHNICIAN">Technician</option>
                                    <option value="USER">User</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={handleCloseModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create User'}
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
