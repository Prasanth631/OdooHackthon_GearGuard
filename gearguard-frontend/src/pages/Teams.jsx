import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, UserPlus, Edit, ChevronDown, ChevronUp } from 'lucide-react';

function Teams() {
    const [expandedTeam, setExpandedTeam] = useState(null);

    const teams = [
        { id: 1, name: 'Mechanics', description: 'Heavy machinery repairs', color: '#ef4444', requestsCount: 15, completedCount: 42, members: [{ id: 1, name: 'John Smith', role: 'Team Lead' }, { id: 2, name: 'Mike Johnson', role: 'Senior Tech' }] },
        { id: 2, name: 'Electricians', description: 'Electrical systems', color: '#f59e0b', requestsCount: 9, completedCount: 31, members: [{ id: 3, name: 'David Brown', role: 'Team Lead' }] },
        { id: 3, name: 'IT Support', description: 'Computers and servers', color: '#3b82f6', requestsCount: 12, completedCount: 56, members: [{ id: 4, name: 'Alex Chen', role: 'Team Lead' }, { id: 5, name: 'Jessica Lee', role: 'System Admin' }] },
        { id: 4, name: 'HVAC', description: 'Heating and cooling', color: '#10b981', requestsCount: 6, completedCount: 18, members: [{ id: 6, name: 'Chris Anderson', role: 'Team Lead' }] },
    ];

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <div>
                    <h1 className="page-title">Maintenance Teams</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage teams and members</p>
                </div>
                <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Create Team</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teams.map((team, index) => (
                    <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: team.color + '20' }}>
                                    <Users className="w-6 h-6" style={{ color: team.color }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                                    <p className="text-sm text-gray-500">{team.description}</p>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4 text-gray-500" /></button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{team.members.length}</p>
                                <p className="text-xs text-gray-500">Members</p>
                            </div>
                            <div className="text-center border-x border-gray-200 dark:border-gray-600">
                                <p className="text-2xl font-bold" style={{ color: team.color }}>{team.requestsCount}</p>
                                <p className="text-xs text-gray-500">Active</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{team.completedCount}</p>
                                <p className="text-xs text-gray-500">Completed</p>
                            </div>
                        </div>

                        <button onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)} className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            {expandedTeam === team.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {expandedTeam === team.id ? 'Hide' : 'View'} Members
                        </button>

                        {expandedTeam === team.id && (
                            <div className="mt-4 space-y-3">
                                {team.members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: team.color }}>{getInitials(member.name)}</div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <UserPlus className="w-4 h-4" /> Add Member
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Teams;
