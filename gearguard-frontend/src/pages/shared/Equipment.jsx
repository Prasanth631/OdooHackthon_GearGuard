import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Wrench, MapPin, ClipboardList, Eye, Edit, Trash2 } from 'lucide-react';

function Equipment() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const equipment = [
        { id: 1, name: 'CNC Machine Alpha', serialNumber: 'CNC-2024-001', category: 'Machinery', department: 'Production', location: 'Building A, Floor 1', status: 'ACTIVE', healthScore: 85, team: 'Mechanics', openRequests: 2 },
        { id: 2, name: '3D Printer Pro', serialNumber: 'PRT-2024-002', category: 'Machinery', department: 'Production', location: 'Building A, Floor 2', status: 'ACTIVE', healthScore: 92, team: 'Mechanics', openRequests: 0 },
        { id: 3, name: 'Main Server Rack', serialNumber: 'SRV-2024-001', category: 'IT Equipment', department: 'IT', location: 'Server Room', status: 'ACTIVE', healthScore: 98, team: 'IT Support', openRequests: 1 },
        { id: 4, name: 'Forklift #3', serialNumber: 'FLT-2024-003', category: 'Vehicle', department: 'Logistics', location: 'Warehouse B', status: 'MAINTENANCE', healthScore: 45, team: 'Mechanics', openRequests: 3 },
        { id: 5, name: 'Office Printer HP', serialNumber: 'OPR-2024-001', category: 'Office Equipment', department: 'Administration', location: 'Admin Block', status: 'ACTIVE', healthScore: 60, team: 'IT Support', openRequests: 1 },
    ];

    const categories = ['all', ...new Set(equipment.map(e => e.category))];

    const filteredEquipment = equipment.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getHealthColor = (score) => {
        if (score >= 80) return 'text-green-500 bg-green-100 dark:bg-green-900/30';
        if (score >= 50) return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30';
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'MAINTENANCE': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'INACTIVE': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
            case 'SCRAPPED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Equipment</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track all your company assets</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Equipment
                </button>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by name or serial number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-field w-48">
                            {categories.map(cat => (<option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>))}
                        </select>
                    </div>
                </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Equipment</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Category</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Location</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Health</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Maintenance</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEquipment.map((item, index) => (
                                <motion.tr key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                                <Wrench className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{item.serialNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4"><span className="text-sm text-gray-600 dark:text-gray-300">{item.category}</span></td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <MapPin className="w-4 h-4 text-gray-400" />{item.location}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${item.healthScore >= 80 ? 'bg-green-500' : item.healthScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${item.healthScore}%` }} />
                                            </div>
                                            <span className={`text-sm font-medium px-2 py-0.5 rounded ${getHealthColor(item.healthScore)}`}>{item.healthScore}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4"><span className={`badge ${getStatusStyle(item.status)}`}>{item.status}</span></td>
                                    <td className="py-4 px-4">
                                        <button className="relative flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                            <ClipboardList className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Requests</span>
                                            {item.openRequests > 0 && (<span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{item.openRequests}</span>)}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Eye className="w-4 h-4 text-gray-500" /></button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Edit className="w-4 h-4 text-gray-500" /></button>
                                            <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredEquipment.length === 0 && (
                    <div className="text-center py-12">
                        <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No equipment found</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default Equipment;
