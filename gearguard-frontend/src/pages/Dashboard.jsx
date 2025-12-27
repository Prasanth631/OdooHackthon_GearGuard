import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, ClipboardList, CheckCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

function Dashboard() {
    const [stats] = useState({
        totalEquipment: 47,
        activeRequests: 12,
        completedToday: 5,
        overdueRequests: 3
    });

    const requestsByTeam = [
        { name: 'Mechanics', requests: 15, color: '#ef4444' },
        { name: 'Electricians', requests: 9, color: '#f59e0b' },
        { name: 'IT Support', requests: 12, color: '#3b82f6' },
        { name: 'HVAC', requests: 6, color: '#10b981' },
    ];

    const requestsByStatus = [
        { name: 'New', value: 8, color: '#6366f1' },
        { name: 'In Progress', value: 5, color: '#f59e0b' },
        { name: 'Repaired', value: 15, color: '#10b981' },
        { name: 'Scrap', value: 2, color: '#6b7280' },
    ];

    const recentActivity = [
        { id: 1, message: 'CNC Machine Alpha marked as repaired', time: '10 min ago', type: 'success' },
        { id: 2, message: 'New request: Forklift #3 oil leak', time: '25 min ago', type: 'new' },
        { id: 3, message: 'Server Rack maintenance scheduled', time: '1 hour ago', type: 'scheduled' },
        { id: 4, message: 'Overdue: Printer HP repair pending', time: '2 hours ago', type: 'overdue' },
    ];

    const statCards = [
        { title: 'Total Equipment', value: stats.totalEquipment, icon: Wrench, gradient: 'from-blue-500 to-blue-700' },
        { title: 'Active Requests', value: stats.activeRequests, icon: ClipboardList, gradient: 'from-amber-500 to-orange-600' },
        { title: 'Completed Today', value: stats.completedToday, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
        { title: 'Overdue', value: stats.overdueRequests, icon: AlertTriangle, gradient: 'from-red-500 to-rose-600', pulse: stats.overdueRequests > 0 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your maintenance operations</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    Last updated: Just now
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`stat-card bg-gradient-to-br ${stat.gradient} ${stat.pulse ? 'animate-pulse-slow' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">{stat.title}</p>
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
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requests by Team</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={requestsByTeam}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                            <YAxis tick={{ fill: '#6b7280' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Bar dataKey="requests" radius={[8, 8, 0, 0]}>
                                {requestsByTeam.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Requests by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={requestsByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                {requestsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${activity.type === 'success' ? 'bg-green-100 text-green-600' : ''}
                                ${activity.type === 'new' ? 'bg-blue-100 text-blue-600' : ''}
                                ${activity.type === 'scheduled' ? 'bg-purple-100 text-purple-600' : ''}
                                ${activity.type === 'overdue' ? 'bg-red-100 text-red-600' : ''}
                            `}>
                                {activity.type === 'success' && <CheckCircle className="w-5 h-5" />}
                                {activity.type === 'new' && <ClipboardList className="w-5 h-5" />}
                                {activity.type === 'scheduled' && <Clock className="w-5 h-5" />}
                                {activity.type === 'overdue' && <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default Dashboard;
