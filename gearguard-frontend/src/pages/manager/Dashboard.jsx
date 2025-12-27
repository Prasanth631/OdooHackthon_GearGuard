import { motion } from 'framer-motion';
import { Users, ClipboardList, Calendar, UserPlus, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function ManagerDashboard() {
    const { user } = useAuth();

    const stats = [
        { title: 'Team Members', value: 8, icon: Users, gradient: 'from-blue-500 to-blue-700' },
        { title: 'Open Requests', value: 15, icon: ClipboardList, gradient: 'from-amber-500 to-orange-600' },
        { title: 'Scheduled Today', value: 3, icon: Calendar, gradient: 'from-green-500 to-emerald-600' },
        { title: 'Avg Response Time', value: '2.5h', icon: Clock, gradient: 'from-purple-500 to-purple-700' }
    ];

    const teamPerformance = [
        { name: 'Mechanics', completed: 45, pending: 5 },
        { name: 'Electricians', completed: 32, pending: 8 },
        { name: 'IT Support', completed: 28, pending: 3 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.fullName}</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Technician
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
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance</h2>
                    <div className="space-y-4">
                        {teamPerformance.map((team) => (
                            <div key={team.name} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white">{team.name}</span>
                                    <span className="text-sm text-gray-500">{team.completed + team.pending} total</span>
                                </div>
                                <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                                    <div
                                        className="bg-green-500 rounded-full"
                                        style={{ width: `${(team.completed / (team.completed + team.pending)) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>{team.completed} completed</span>
                                    <span>{team.pending} pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Schedule</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                            <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">09:00</p>
                                <p className="text-xs text-gray-500">AM</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">CNC Machine Inspection</p>
                                <p className="text-sm text-gray-500">Assigned: John Smith</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
                            <div className="text-center">
                                <p className="text-lg font-bold text-amber-600">14:00</p>
                                <p className="text-xs text-gray-500">PM</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Server Maintenance</p>
                                <p className="text-sm text-gray-500">Assigned: Alex Chen</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;
