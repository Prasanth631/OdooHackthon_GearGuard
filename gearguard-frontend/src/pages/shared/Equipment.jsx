import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Wrench, Edit2, Trash2, Eye, EyeOff, AlertCircle, CheckCircle, X, QrCode, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import equipmentApi from '../../api/equipmentApi';
import api from '../../api/axios';

function Equipment() {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrData, setQrData] = useState({ id: null, name: '', imageUrl: null });
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        serialNumber: '',
        category: '',
        location: '',
        status: 'ACTIVE',
        healthScore: 100,
        notes: '',
        departmentId: '',
        maintenanceTeamId: '',
        assignedToId: ''
    });

    useEffect(() => {
        fetchEquipment();
        fetchCategories();
        fetchDepartments();
        fetchTeams();
        fetchUsers();
    }, [statusFilter, categoryFilter]);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (categoryFilter) params.category = categoryFilter;
            const response = await equipmentApi.getAll(params);
            setEquipment(response.data);
        } catch (error) {
            toast.error('Failed to load equipment');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await equipmentApi.getCategories();
            setCategories(response.data);
        } catch (error) {
            setCategories(['Machinery', 'IT Equipment', 'Vehicles', 'Office Equipment', 'HVAC', 'Electrical']);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to load departments');
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams');
            setTeams(response.data);
        } catch (error) {
            console.error('Failed to load teams');
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data.filter(u => u.role === 'TECHNICIAN' || u.role === 'USER'));
        } catch (error) {
            console.error('Failed to load users');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
                maintenanceTeamId: formData.maintenanceTeamId ? parseInt(formData.maintenanceTeamId) : null,
                assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : null
            };

            if (editingEquipment) {
                await equipmentApi.update(editingEquipment.id, submitData);
                toast.success('Equipment updated');
            } else {
                await equipmentApi.create(submitData);
                toast.success('Equipment created');
            }
            setShowModal(false);
            resetForm();
            fetchEquipment();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (item) => {
        setEditingEquipment(item);
        setFormData({
            name: item.name,
            serialNumber: item.serialNumber,
            category: item.category || '',
            location: item.location || '',
            status: item.status,
            healthScore: item.healthScore,
            notes: item.notes || '',
            departmentId: item.departmentId || '',
            maintenanceTeamId: item.maintenanceTeamId || '',
            assignedToId: item.assignedToId || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this equipment?')) return;
        try {
            await equipmentApi.delete(id);
            toast.success('Equipment deleted');
            fetchEquipment();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const handleShowQR = async (id, name) => {
        try {
            const response = await api.get(`/qrcode/equipment/${id}`, { responseType: 'blob' });
            const imageUrl = window.URL.createObjectURL(new Blob([response.data]));
            setQrData({ id, name, imageUrl });
            setShowQRModal(true);
        } catch (error) {
            toast.error('Failed to load QR code');
        }
    };

    const handleDownloadQR = async () => {
        if (!qrData.id) return;
        try {
            const response = await api.get(`/qrcode/equipment/${qrData.id}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${qrData.name}_qr.png`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('QR code downloaded!');
        } catch (error) {
            toast.error('Failed to download QR code');
        }
    };

    const resetForm = () => {
        setEditingEquipment(null);
        setCustomCategory('');
        setShowCustomCategory(false);
        setFormData({
            name: '',
            serialNumber: '',
            category: '',
            location: '',
            status: 'ACTIVE',
            healthScore: 100,
            notes: '',
            departmentId: '',
            maintenanceTeamId: '',
            assignedToId: ''
        });
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            MAINTENANCE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            INACTIVE: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
            SCRAPPED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
        return colors[status] || colors.ACTIVE;
    };

    const getHealthColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const filteredEquipment = equipment.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Equipment</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your equipment inventory</p>
                </div>
                <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Equipment
                </button>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or serial..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field w-full md:w-40"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="SCRAPPED">Scrapped</option>
                    </select>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="input-field w-full md:w-40"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredEquipment.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                        <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No equipment found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Serial</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Category</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Location</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Health</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEquipment.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                                    <Wrench className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-slate-400">{item.serialNumber}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-slate-400">{item.category || '-'}</td>
                                        <td className="py-3 px-4 text-gray-600 dark:text-slate-400">{item.location || '-'}</td>
                                        <td className="py-3 px-4">
                                            <span className={`font-semibold ${getHealthColor(item.healthScore)}`}>
                                                {item.healthScore}%
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleShowQR(item.id, item.name)}
                                                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="View QR Code"
                                                >
                                                    <QrCode className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl border dark:border-slate-800 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Serial Number <span className="text-xs text-gray-400">(optional)</span></label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.serialNumber}
                                            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                            className="input-field flex-1"
                                            placeholder="Leave empty or click Generate"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                                                const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
                                                setFormData({ ...formData, serialNumber: `EQ-${date}-${rand}` });
                                            }}
                                            className="px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 text-sm font-medium"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">Category</label>
                                    {!showCustomCategory ? (
                                        <div className="flex gap-2">
                                            <select
                                                value={formData.category}
                                                onChange={(e) => {
                                                    if (e.target.value === '__custom__') {
                                                        setShowCustomCategory(true);
                                                    } else {
                                                        setFormData({ ...formData, category: e.target.value });
                                                    }
                                                }}
                                                className="input-field flex-1"
                                            >
                                                <option value="">Select category</option>
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                <option value="__custom__">+ Add Custom</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                placeholder="Enter custom category"
                                                className="input-field flex-1"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (customCategory.trim()) {
                                                        setFormData({ ...formData, category: customCategory.trim() });
                                                        setCategories([...categories, customCategory.trim()]);
                                                        setShowCustomCategory(false);
                                                        setCustomCategory('');
                                                    }
                                                }}
                                                className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setShowCustomCategory(false); setCustomCategory(''); }}
                                                className="px-3 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="form-label">Department</label>
                                    <select
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Select department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Maintenance Team</label>
                                    <select
                                        value={formData.maintenanceTeamId}
                                        onChange={(e) => setFormData({ ...formData, maintenanceTeamId: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Select team</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Assigned To</label>
                                    <select
                                        value={formData.assignedToId}
                                        onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="">Select employee</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="MAINTENANCE">Maintenance</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="SCRAPPED">Scrapped</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="form-label">Health Score: {formData.healthScore}%</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={formData.healthScore}
                                        onChange={(e) => setFormData({ ...formData, healthScore: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="form-label">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="input-field"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingEquipment ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowQRModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">QR Code</h2>
                            <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-gray-600 dark:text-slate-400 mb-4">{qrData.name}</p>
                            {qrData.imageUrl && (
                                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                                    <img src={qrData.imageUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                                </div>
                            )}
                            <p className="text-sm text-gray-500 dark:text-slate-500 mb-4">
                                Scan this QR code to view equipment details
                            </p>
                            <button
                                onClick={handleDownloadQR}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" /> Download QR Code
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Equipment;
