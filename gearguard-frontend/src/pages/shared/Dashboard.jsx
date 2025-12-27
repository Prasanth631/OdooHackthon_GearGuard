import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, ClipboardList, CheckCircle, AlertTriangle, Clock, RefreshCw, Users, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function Dashboard() {
    const [stats, setStats] = useState({
        totalEquipment: 0,
        activeRequests: 0,
        completedToday: 0,
        overdueRequests: 0
    });
    const [requestsByTeam, setRequestsByTeam] = useState([]);
    const [requestsByStatus, setRequestsByStatus] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        fetchDashboardData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard');
            const data = response.data;

            setStats({
                totalEquipment: data.totalEquipment,
                activeRequests: data.activeRequests,
                completedToday: data.completedToday,
                overdueRequests: data.overdueRequests
            });
            setRequestsByTeam(data.requestsByTeam || []);
            setRequestsByStatus(data.requestsByStatus || []);
            setRecentActivity(data.recentActivity || []);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchDashboardData();
        toast.success('Dashboard refreshed');
    };

    const statCards = [
        { title: 'Total Equipment', value: stats.totalEquipment, icon: Wrench, gradient: 'from-blue-500 to-blue-700', change: '+2 this week' },
        { title: 'Active Requests', value: stats.activeRequests, icon: ClipboardList, gradient: 'from-amber-500 to-orange-600', change: 'Pending' },
        { title: 'Completed Today', value: stats.completedToday, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600', change: 'Great work!' },
        { title: 'Overdue', value: stats.overdueRequests, icon: AlertTriangle, gradient: 'from-red-500 to-rose-600', pulse: stats.overdueRequests > 0, change: stats.overdueRequests > 0 ? 'Needs attention' : 'All clear!' }
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5" />;
            case 'new': return <ClipboardList className="w-5 h-5" />;
            case 'scheduled': return <Clock className="w-5 h-5" />;
            case 'overdue': return <AlertTriangle className="w-5 h-5" />;
            default: return <ClipboardList className="w-5 h-5" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-600';
            case 'new': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
            case 'scheduled': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600';
            case 'overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-600';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600';
        }
    };

    if (loading && !stats.totalEquipment) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time overview of maintenance operations</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                    <button onClick={handleRefresh} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
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
                                <p className="text-white/60 text-xs mt-1">{stat.change}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <stat.icon className="w-7 h-7" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Performance */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-500" /> Team Performance
                        </h2>
                    </div>
                    {requestsByTeam.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={requestsByTeam}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    labelStyle={{ color: '#9ca3af' }}
                                />
                                <Bar dataKey="requests" radius={[8, 8, 0, 0]} name="Requests">
                                    {requestsByTeam.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            <p>No team data available. Assign requests to teams to see stats.</p>
                        </div>
                    )}
                </motion.div>

                {/* Request Breakdown */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" /> Request Breakdown
                        </h2>
                    </div>
                    {requestsByStatus.some(s => s.value > 0) ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={requestsByStatus.filter(s => s.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {requestsByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                                />
                                <Legend
                                    formatter={(value) => <span className="text-gray-600 dark:text-gray-300">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                            <p>No requests yet. Create maintenance requests to see breakdown.</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No recent activity. Start creating maintenance requests!</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default Dashboard;
