import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Building, Calendar, Shield,
    Edit3, Save, X, Lock, Eye, EyeOff, Camera,
    Users, Wrench, ClipboardList, Clock, TrendingUp,
    CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function Profile() {
    const { user, updateProfile, changePassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        department: user?.department || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData({
                fullName: user?.fullName || '',
                phone: user?.phone || '',
                department: user?.department || ''
            });
        }
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = async () => {
        if (!formData.fullName.trim()) {
            toast.error('Full name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Current password is required';
        }
        if (!passwordData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        }
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your new password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) return;

        setIsSubmitting(true);
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            toast.success('Password changed successfully!');
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordErrors({});
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
        setShowPasswords({ current: false, new: false, confirm: false });
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            ADMIN: 'from-purple-500 to-purple-700',
            MANAGER: 'from-blue-500 to-blue-700',
            TECHNICIAN: 'from-green-500 to-green-700',
            USER: 'from-amber-500 to-amber-700'
        };
        return colors[role] || 'from-gray-500 to-gray-700';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStats = () => {
        if (!user?.stats) return null;

        const statsConfig = {
            ADMIN: [
                { key: 'totalUsers', label: 'Total Users', icon: Users, gradient: 'from-blue-500 to-blue-700' },
                { key: 'totalEquipment', label: 'Equipment', icon: Wrench, gradient: 'from-green-500 to-emerald-600' },
                { key: 'totalTeams', label: 'Teams', icon: Shield, gradient: 'from-purple-500 to-purple-700' },
                { key: 'activeRequests', label: 'Active Requests', icon: ClipboardList, gradient: 'from-amber-500 to-orange-600' }
            ],
            MANAGER: [
                { key: 'teamSize', label: 'Team Size', icon: Users, gradient: 'from-blue-500 to-blue-700' },
                { key: 'activeRequests', label: 'Active Requests', icon: ClipboardList, gradient: 'from-amber-500 to-orange-600' },
                { key: 'equipmentAssigned', label: 'Equipment Assigned', icon: Wrench, gradient: 'from-green-500 to-emerald-600' },
                { key: 'completedThisMonth', label: 'Completed This Month', icon: CheckCircle, gradient: 'from-purple-500 to-purple-700' }
            ],
            TECHNICIAN: [
                { key: 'tasksCompleted', label: 'Tasks Completed', icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
                { key: 'pendingTasks', label: 'Pending Tasks', icon: Clock, gradient: 'from-amber-500 to-orange-600' },
                { key: 'avgCompletionTime', label: 'Avg. Completion', icon: TrendingUp, gradient: 'from-blue-500 to-blue-700' },
                { key: 'efficiency', label: 'Efficiency %', icon: TrendingUp, gradient: 'from-purple-500 to-purple-700', suffix: '%' }
            ],
            USER: [
                { key: 'requestsSubmitted', label: 'Requests Submitted', icon: ClipboardList, gradient: 'from-blue-500 to-blue-700' },
                { key: 'requestsResolved', label: 'Resolved', icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
                { key: 'requestsPending', label: 'Pending', icon: Clock, gradient: 'from-amber-500 to-orange-600' },
                { key: 'avgResponseTime', label: 'Avg. Response', icon: TrendingUp, gradient: 'from-purple-500 to-purple-700' }
            ]
        };

        const config = statsConfig[user.role] || [];

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {config.map((stat, index) => (
                    <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1">
                                    {user.stats[stat.key]}{stat.suffix || ''}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your account settings</p>
                </div>
                <button
                    onClick={() => setShowPasswordModal(true)}
                    className="btn-secondary flex items-center gap-2"
                >
                    <Lock className="w-4 h-4" />
                    Change Password
                </button>
            </div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-200 dark:border-slate-800">
                    <div className="relative group">
                        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getRoleBadgeColor(user?.role)} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                            {getInitials(user?.fullName)}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 dark:border-slate-700">
                            <Camera className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h2>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-gradient-to-r ${getRoleBadgeColor(user?.role)} text-white text-sm font-medium`}>
                            <Shield className="w-3.5 h-3.5" />
                            {user?.role}
                        </div>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-2 flex items-center justify-center sm:justify-start gap-1">
                            <Calendar className="w-4 h-4" />
                            Member since {formatDate(user?.joinDate)}
                        </p>
                    </div>
                    <button
                        onClick={handleEditToggle}
                        className={`${isEditing ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
                    >
                        {isEditing ? (
                            <>
                                <X className="w-4 h-4" />
                                Cancel
                            </>
                        ) : (
                            <>
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>

                {/* Profile Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div className="space-y-4">
                        <div>
                            <label className="form-label flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white font-medium">{user?.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="form-label flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </label>
                            <p className="text-gray-900 dark:text-white font-medium">{user?.email}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Email cannot be changed</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="form-label flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter your phone number"
                                />
                            ) : (
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {user?.phone || <span className="text-gray-400 dark:text-slate-500">Not provided</span>}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="form-label flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                Department
                            </label>
                            {isEditing && user?.role === 'ADMIN' ? (
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter your department"
                                />
                            ) : (
                                <>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {user?.department || <span className="text-gray-400 dark:text-slate-500">Not assigned</span>}
                                    </p>
                                    {user?.role !== 'ADMIN' && (
                                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Department is assigned by admin</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end pt-6 border-t border-gray-200 dark:border-slate-800 mt-6"
                    >
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSubmitting}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Stats Section */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Statistics</h3>
                {renderStats()}
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={closePasswordModal}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            Change Password
                        </h2>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="form-label">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className={`input-field pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.currentPassword && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {passwordErrors.currentPassword}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="form-label">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className={`input-field pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                                        placeholder="Enter new password (min 6 characters)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {passwordErrors.newPassword}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="form-label">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className={`input-field pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {passwordErrors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closePasswordModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary flex-1"
                                >
                                    {isSubmitting ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Profile;
