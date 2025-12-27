import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Clock, CheckCircle, Wrench, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { requestApi } from '../../api/requestApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function UserDashboard() {
    const { user } = useAuth();
    const [showNewRequest, setShowNewRequest] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [myRequests, setMyRequests] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [formData, setFormData] = useState({ subject: '', equipmentId: '', description: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requestsRes, equipmentRes] = await Promise.all([
                requestApi.getAll(),
                api.get('/equipment')
            ]);

            // Filter requests created by current user
            const allRequests = requestsRes.data || [];
            const userRequests = allRequests.filter(r => r.requestedById === user?.id);
            setMyRequests(userRequests);
            setEquipment(equipmentRes.data || []);
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await requestApi.create({
                subject: formData.subject,
                equipmentId: parseInt(formData.equipmentId),
                description: formData.description,
                type: 'CORRECTIVE',
                priority: 'MEDIUM'
            });
            toast.success('Issue reported successfully!');
            setShowNewRequest(false);
            setFormData({ subject: '', equipmentId: '', description: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            NEW: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
            IN_PROGRESS: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            REPAIRED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            SCRAP: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        };
        return colors[status] || colors.NEW;
    };

    const getStatusIcon = (status) => {
        const icons = {
            NEW: <Clock className="w-4 h-4" />,
            IN_PROGRESS: <Wrench className="w-4 h-4" />,
            REPAIRED: <CheckCircle className="w-4 h-4" />,
            SCRAP: <X className="w-4 h-4" />
        };
        return icons[status] || icons.NEW;
    };

    const totalRequests = myRequests.length;
    const inProgress = myRequests.filter(r => r.stage === 'IN_PROGRESS').length;
    const resolved = myRequests.filter(r => r.stage === 'REPAIRED').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome, {user?.fullName}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => setShowNewRequest(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Report Issue
                    </button>
                </div>
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
                            <p className="text-4xl font-bold mt-2">{loading ? '...' : totalRequests}</p>
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
                            <p className="text-4xl font-bold mt-2">{loading ? '...' : inProgress}</p>
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
                            <p className="text-4xl font-bold mt-2">{loading ? '...' : resolved}</p>
                        </div>
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-7 h-7" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Requests</h2>
                {myRequests.length > 0 ? (
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
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(request.stage)}`}>
                                            {getStatusIcon(request.stage)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{request.subject}</p>
                                            <p className="text-sm text-gray-500">{request.equipmentName} • {request.createdAt?.split('T')[0]}</p>
                                        </div>
                                    </div>
                                    <span className={`badge ${getStatusColor(request.stage)}`}>
                                        {request.stage?.replace('_', ' ')}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No requests yet. Click "Report Issue" to create one.</p>
                    </div>
                )}
            </div>

            {showNewRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report an Issue</h2>
                            <button onClick={() => setShowNewRequest(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmitRequest}>
                            <div>
                                <label className="form-label">Subject *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Brief description of the issue"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Equipment *</label>
                                <select
                                    className="input-field"
                                    value={formData.equipmentId}
                                    onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Select equipment</option>
                                    {equipment.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="input-field"
                                    rows={3}
                                    placeholder="Detailed description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowNewRequest(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default UserDashboard;
