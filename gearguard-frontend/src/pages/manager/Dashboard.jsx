import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, Calendar, UserPlus, Clock, RefreshCw, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function ManagerDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        teamMembers: 0,
        openRequests: 0,
        scheduledToday: 0,
        overdueCount: 0
    });
    const [teamPerformance, setTeamPerformance] = useState([]);
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'TECHNICIAN'
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [dashboardRes, teamsRes, requestsRes] = await Promise.all([
                api.get('/dashboard'),
                api.get('/teams'),
                api.get('/requests')
            ]);

            // Calculate stats
            const requests = requestsRes.data || [];
            const today = new Date().toISOString().split('T')[0];
            const scheduledToday = requests.filter(r => r.scheduledDate === today).length;

            setStats({
                teamMembers: teamsRes.data?.reduce((acc, t) => acc + (t.memberCount || 0), 0) || 0,
                openRequests: dashboardRes.data?.activeRequests || 0,
                scheduledToday: scheduledToday,
                overdueCount: dashboardRes.data?.overdueRequests || 0
            });

            // Team performance
            const teams = teamsRes.data || [];
            const performance = teams.map(team => ({
                name: team.name,
                color: team.color,
                completed: team.completedCount || 0,
                pending: team.requestsCount || 0
            }));
            setTeamPerformance(performance);

            // Today's schedule
            const todayTasks = requests
                .filter(r => r.scheduledDate === today)
                .slice(0, 4)
                .map(r => ({
                    id: r.id,
                    subject: r.subject,
                    assignee: r.assignedToName || 'Unassigned',
                    time: '09:00',
                    color: r.priority === 'CRITICAL' ? '#ef4444' : r.priority === 'HIGH' ? '#f59e0b' : '#3b82f6'
                }));
            setTodaySchedule(todayTasks);

        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTechnician = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/auth/create-user', formData);
            toast.success('Technician added successfully!');
            setShowAddModal(false);
            setFormData({ fullName: '', email: '', password: '', role: 'TECHNICIAN' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add technician');
        } finally {
            setSubmitting(false);
        }
    };

    const statCards = [
        { title: 'Team Members', value: stats.teamMembers, icon: Users, gradient: 'from-blue-500 to-blue-700' },
        { title: 'Open Requests', value: stats.openRequests, icon: ClipboardList, gradient: 'from-amber-500 to-orange-600' },
        { title: 'Scheduled Today', value: stats.scheduledToday, icon: Calendar, gradient: 'from-green-500 to-emerald-600' },
        { title: 'Overdue', value: stats.overdueCount, icon: AlertTriangle, gradient: 'from-red-500 to-rose-600', pulse: stats.overdueCount > 0 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.fullName}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Add Technician
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Performance</h2>
                    {teamPerformance.length > 0 ? (
                        <div className="space-y-4">
                            {teamPerformance.map((team) => (
                                <div key={team.name} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }}></div>
                                            <span className="font-medium text-gray-900 dark:text-white">{team.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">{team.completed + team.pending} total</span>
                                    </div>
                                    <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                                        <div
                                            className="bg-green-500 rounded-full"
                                            style={{ width: `${team.completed + team.pending > 0 ? (team.completed / (team.completed + team.pending)) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                                        <span>{team.completed} completed</span>
                                        <span>{team.pending} pending</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No teams yet. Create teams to see performance.</p>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Schedule</h2>
                    {todaySchedule.length > 0 ? (
                        <div className="space-y-3">
                            {todaySchedule.map((task) => (
                                <div key={task.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg" style={{ borderLeft: `4px solid ${task.color}` }}>
                                    <div className="text-center">
                                        <p className="text-lg font-bold" style={{ color: task.color }}>{task.time}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{task.subject}</p>
                                        <p className="text-sm text-gray-500">Assigned: {task.assignee}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No tasks scheduled for today.</p>
                    )}
                </div>
            </div>

            {/* Add Technician Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Technician</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleAddTechnician} className="space-y-4">
                            <div>
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter full name"
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
                                    placeholder="technician@company.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field"
                                    placeholder="Create password"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="form-label">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="TECHNICIAN">Technician</option>
                                    <option value="USER">User</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                                    {submitting ? 'Adding...' : 'Add Technician'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default ManagerDashboard;
