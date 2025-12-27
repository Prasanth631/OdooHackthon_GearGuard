import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Clock, CheckCircle, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function UserDashboard() {
    const { user } = useAuth();
    const [showNewRequest, setShowNewRequest] = useState(false);

    const myRequests = [
        { id: 1, subject: 'Laptop not starting', equipment: 'Laptop L-042', status: 'IN_PROGRESS', date: '2024-12-26' },
        { id: 2, subject: 'Monitor flickering', equipment: 'Monitor M-015', status: 'REPAIRED', date: '2024-12-24' },
        { id: 3, subject: 'Keyboard keys stuck', equipment: 'Keyboard K-089', status: 'NEW', date: '2024-12-27' }
    ];

    const getStatusColor = (status) => {
        const colors = {
            NEW: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
            IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            REPAIRED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        };
        return colors[status] || colors.NEW;
    };

    const getStatusIcon = (status) => {
        const icons = {
            NEW: <Clock className="w-4 h-4" />,
            IN_PROGRESS: <Wrench className="w-4 h-4" />,
            REPAIRED: <CheckCircle className="w-4 h-4" />
        };
        return icons[status] || icons.NEW;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome, {user?.fullName}</p>
                </div>
                <button
                    onClick={() => setShowNewRequest(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Report Issue
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="stat-card bg-gradient-to-br from-blue-500 to-blue-700"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">Total Requests</p>
                            <p className="text-4xl font-bold mt-2">{myRequests.length}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <ClipboardList className="w-7 h-7" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="stat-card bg-gradient-to-br from-amber-500 to-orange-600"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">In Progress</p>
                            <p className="text-4xl font-bold mt-2">{myRequests.filter(r => r.status === 'IN_PROGRESS').length}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Wrench className="w-7 h-7" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="stat-card bg-gradient-to-br from-green-500 to-emerald-600"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm">Resolved</p>
                            <p className="text-4xl font-bold mt-2">{myRequests.filter(r => r.status === 'REPAIRED').length}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-7 h-7" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Requests</h2>
                <div className="space-y-4">
                    {myRequests.map((request) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(request.status)}`}>
                                        {getStatusIcon(request.status)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{request.subject}</p>
                                        <p className="text-sm text-gray-500">{request.equipment} • {request.date}</p>
                                    </div>
                                </div>
                                <span className={`badge ${getStatusColor(request.status)}`}>
                                    {request.status.replace('_', ' ')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {showNewRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
                    >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Report an Issue</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Request submitted'); setShowNewRequest(false); }}>
                            <div>
                                <label className="form-label">Subject</label>
                                <input type="text" className="input-field" placeholder="Brief description of the issue" required />
                            </div>
                            <div>
                                <label className="form-label">Equipment</label>
                                <select className="input-field" required>
                                    <option value="">Select equipment</option>
                                    <option value="1">Laptop L-042</option>
                                    <option value="2">Monitor M-015</option>
                                    <option value="3">Keyboard K-089</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea className="input-field" rows={3} placeholder="Detailed description..."></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowNewRequest(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1">Submit</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default UserDashboard;
