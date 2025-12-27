import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, Clock, Wrench, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { requestApi } from '../../api/requestApi';
import toast from 'react-hot-toast';

function TechnicianDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [myJobs, setMyJobs] = useState([]);
    const [stats, setStats] = useState({
        activeJobs: 0,
        completedToday: 0,
        urgent: 0
    });

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await requestApi.getAll();
            const allRequests = response.data || [];

            // Filter jobs assigned to current user or unassigned
            const jobs = allRequests.filter(r =>
                r.assignedToId === user?.id ||
                (r.stage === 'NEW' || r.stage === 'IN_PROGRESS')
            );

            setMyJobs(jobs);

            // Calculate stats
            const today = new Date().toISOString().split('T')[0];
            setStats({
                activeJobs: jobs.filter(j => j.stage === 'NEW' || j.stage === 'IN_PROGRESS').length,
                completedToday: allRequests.filter(j => j.stage === 'REPAIRED' && j.completedAt?.startsWith(today)).length,
                urgent: jobs.filter(j => j.priority === 'CRITICAL' || j.priority === 'HIGH' || j.isOverdue).length
            });
        } catch (error) {
            console.error('Failed to load jobs', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStage = async (jobId, newStage) => {
        try {
            await requestApi.updateStage(jobId, newStage);
            toast.success(`Job updated to ${newStage.replace('_', ' ')}`);
            fetchMyJobs();
        } catch (error) {
            toast.error('Failed to update job');
        }
    };

    const statCards = [
        { title: 'My Active Jobs', value: stats.activeJobs, icon: ClipboardList, gradient: 'from-blue-500 to-blue-700' },
        { title: 'Completed Today', value: stats.completedToday, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
        { title: 'Urgent', value: stats.urgent, icon: AlertTriangle, gradient: 'from-red-500 to-rose-600', pulse: stats.urgent > 0 }
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
            MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse'
        };
        return colors[priority] || colors.MEDIUM;
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Technician Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.fullName}</p>
                </div>
                <button onClick={fetchMyJobs} className="btn-secondary flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`stat-card bg-gradient-to-br ${stat.gradient} ${stat.pulse ? 'animate-pulse-slow' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm">{stat.title}</p>
                                <p className="text-4xl font-bold mt-2">{loading ? '...' : stat.value}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Assigned Jobs</h2>
                {myJobs.filter(j => j.stage !== 'REPAIRED' && j.stage !== 'SCRAP').length > 0 ? (
                    <div className="space-y-4">
                        {myJobs
                            .filter(j => j.stage !== 'REPAIRED' && j.stage !== 'SCRAP')
                            .map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between ${job.isOverdue ? 'border-l-4 border-red-500' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                            <Wrench className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{job.subject}</p>
                                            <p className="text-sm text-gray-500">{job.equipmentName}</p>
                                            {job.isOverdue && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Overdue</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                                        <span className={`badge ${getStatusColor(job.stage)}`}>{job.stage?.replace('_', ' ')}</span>
                                        {job.stage === 'NEW' && (
                                            <button onClick={() => handleUpdateStage(job.id, 'IN_PROGRESS')} className="btn-primary text-sm py-1.5 px-3">
                                                Start
                                            </button>
                                        )}
                                        {job.stage === 'IN_PROGRESS' && (
                                            <button onClick={() => handleUpdateStage(job.id, 'REPAIRED')} className="btn-primary text-sm py-1.5 px-3">
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                        <p>No active jobs. You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TechnicianDashboard;
