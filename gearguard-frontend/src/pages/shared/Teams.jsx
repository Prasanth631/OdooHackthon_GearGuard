import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, UserPlus, Edit, ChevronDown, ChevronUp, Trash2, X, Crown, Search } from 'lucide-react';
import { teamApi } from '../../api/teamApi';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function Teams() {
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', description: '', color: '#3B82F6' });
    const [memberUserId, setMemberUserId] = useState('');

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

    useEffect(() => {
        fetchTeams();
        fetchUsers();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await teamApi.getAll();
            setTeams(response.data);
        } catch (error) {
            toast.error('Failed to load teams');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to load users');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTeam) {
                await teamApi.update(editingTeam.id, formData);
                toast.success('Team updated successfully');
            } else {
                await teamApi.create(formData);
                toast.success('Team created successfully');
            }
            setShowModal(false);
            setEditingTeam(null);
            setFormData({ name: '', description: '', color: '#3B82F6' });
            fetchTeams();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setFormData({ name: team.name, description: team.description || '', color: team.color });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this team?')) return;
        try {
            await teamApi.delete(id);
            toast.success('Team deleted successfully');
            fetchTeams();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete team');
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await teamApi.addMember(selectedTeamId, { userId: parseInt(memberUserId), isLead: false });
            toast.success('Member added successfully');
            setShowMemberModal(false);
            setMemberUserId('');
            fetchTeams();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add member');
        }
    };

    const handleRemoveMember = async (teamId, memberId) => {
        if (!confirm('Remove this member from the team?')) return;
        try {
            await teamApi.removeMember(teamId, memberId);
            toast.success('Member removed');
            fetchTeams();
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    const handleSetLead = async (teamId, memberId) => {
        try {
            await teamApi.setTeamLead(teamId, memberId);
            toast.success('Team lead updated');
            fetchTeams();
        } catch (error) {
            toast.error('Failed to set team lead');
        }
    };

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="page-title">Maintenance Teams</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage teams and members</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <button onClick={() => { setEditingTeam(null); setFormData({ name: '', description: '', color: '#3B82F6' }); setShowModal(true); }} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Create Team
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTeams.map((team, index) => (
                    <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: team.color + '20' }}>
                                    <Users className="w-6 h-6" style={{ color: team.color }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                                    <p className="text-sm text-gray-500">{team.description || 'No description'}</p>
                                    {team.leadName && (
                                        <p className="text-xs text-primary-500 flex items-center gap-1 mt-1">
                                            <Crown className="w-3 h-3" /> Lead: {team.leadName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(team)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <Edit className="w-4 h-4 text-gray-500" />
                                </button>
                                <button onClick={() => handleDelete(team.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{team.memberCount || 0}</p>
                                <p className="text-xs text-gray-500">Members</p>
                            </div>
                            <div className="text-center border-x border-gray-200 dark:border-gray-600">
                                <p className="text-2xl font-bold" style={{ color: team.color }}>{team.requestsCount || 0}</p>
                                <p className="text-xs text-gray-500">Active</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{team.completedCount || 0}</p>
                                <p className="text-xs text-gray-500">Completed</p>
                            </div>
                        </div>

                        <button onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)} className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            {expandedTeam === team.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {expandedTeam === team.id ? 'Hide' : 'View'} Members ({team.members?.length || 0})
                        </button>

                        {expandedTeam === team.id && (
                            <div className="mt-4 space-y-3">
                                {team.members?.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: team.color }}>
                                                {getInitials(member.fullName)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                    {member.fullName}
                                                    {member.isLead && <Crown className="w-4 h-4 text-amber-500" />}
                                                </p>
                                                <p className="text-xs text-gray-500">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {!member.isLead && (
                                                <button onClick={() => handleSetLead(team.id, member.memberId)} className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded text-amber-600" title="Set as Lead">
                                                    <Crown className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => handleRemoveMember(team.id, member.memberId)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500" title="Remove">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => { setSelectedTeamId(team.id); setShowMemberModal(true); }} className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400">
                                    <UserPlus className="w-4 h-4" /> Add Member
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {filteredTeams.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No teams found</h3>
                    <p className="text-gray-500 mt-1">Create a new team to get started</p>
                </div>
            )}

            {/* Create/Edit Team Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{editingTeam ? 'Edit Team' : 'Create Team'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" rows="3" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map(color => (
                                        <button key={color} type="button" onClick={() => setFormData({ ...formData, color })} className={`w-8 h-8 rounded-lg ${formData.color === color ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white' : ''}`} style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">{editingTeam ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Add Member Modal */}
            {showMemberModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Team Member</h2>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select User *</label>
                                <select value={memberUserId} onChange={(e) => setMemberUserId(e.target.value)} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" required>
                                    <option value="">Choose a user...</option>
                                    {users.filter(u => u.role === 'TECHNICIAN' || u.role === 'MANAGER').map(user => (
                                        <option key={user.id} value={user.id}>{user.fullName} ({user.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowMemberModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">Add Member</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Teams;
