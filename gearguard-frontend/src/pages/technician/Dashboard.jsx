import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle, Clock, Wrench, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function TechnicianDashboard() {
    const { user } = useAuth();

    const stats = [
        { title: 'My Active Jobs', value: 3, icon: ClipboardList, gradient: 'from-blue-500 to-blue-700' },
        { title: 'Completed Today', value: 2, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
        { title: 'Avg Time/Job', value: '1.5h', icon: Clock, gradient: 'from-amber-500 to-orange-600' },
        { title: 'Urgent', value: 1, icon: AlertTriangle, gradient: 'from-red-500 to-rose-600' }
    ];

    const myJobs = [
        { id: 1, subject: 'CNC Machine oil leak', equipment: 'CNC Machine Alpha', priority: 'HIGH', status: 'IN_PROGRESS' },
        { id: 2, subject: 'Forklift inspection', equipment: 'Forklift #3', priority: 'MEDIUM', status: 'NEW' },
        { id: 3, subject: 'Conveyor belt repair', equipment: 'Conveyor B2', priority: 'LOW', status: 'NEW' }
    ];

    const getPriorityColor = (priority) => {
        const colors = {
            LOW: 'bg-gray-100 text-gray-700',
            MEDIUM: 'bg-blue-100 text-blue-700',
            HIGH: 'bg-orange-100 text-orange-700',
            CRITICAL: 'bg-red-100 text-red-700'
        };
        return colors[priority] || colors.MEDIUM;
    };

    const getStatusColor = (status) => {
        const colors = {
            NEW: 'bg-indigo-100 text-indigo-700',
            IN_PROGRESS: 'bg-amber-100 text-amber-700',
            REPAIRED: 'bg-green-100 text-green-700'
        };
        return colors[status] || colors.NEW;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Technician Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.fullName}</p>
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

            <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Assigned Jobs</h2>
                <div className="space-y-4">
                    {myJobs.map((job) => (
                        <motion.div trapdoor
                            key={job.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                    <Wrench className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{job.subject}</p>
                                    <p className="text-sm text-gray-500">{job.equipment}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`badge ${getPriorityColor(job.priority)}`}>{job.priority}</span>
                                <span className={`badge ${getStatusColor(job.status)}`}>{job.status.replace('_', ' ')}</span>
                                <button className="btn-primary text-sm py-1.5 px-3">
                                    {job.status === 'NEW' ? 'Start' : 'Update'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TechnicianDashboard;
