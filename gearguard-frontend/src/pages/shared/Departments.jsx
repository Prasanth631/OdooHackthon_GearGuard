import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Building2, Edit2, Trash2, Users, Wrench, X } from 'lucide-react';
import toast from 'react-hot-toast';
import departmentApi from '../../api/departmentApi';

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await departmentApi.getAll();
            setDepartments(response.data);
        } catch (error) {
            toast.error('Failed to load departments');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDepartment) {
                await departmentApi.update(editingDepartment.id, formData);
                toast.success('Department updated');
            } else {
                await departmentApi.create(formData);
                toast.success('Department created');
            }
            setShowModal(false);
            resetForm();
            fetchDepartments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (dept) => {
        setEditingDepartment(dept);
        setFormData({
            name: dept.name,
            description: dept.description || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this department?')) return;
        try {
            await departmentApi.delete(id);
            toast.success('Department deleted');
            fetchDepartments();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const resetForm = () => {
        setEditingDepartment(null);
        setFormData({ name: '', description: '' });
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Departments</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Manage organization departments</p>
                </div>
                <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Department
                </button>
            </div>

            <div className="card">
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search departments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredDepartments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No departments found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDepartments.map((dept, index) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(dept)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                                        </button>
                                        <button onClick={() => handleDelete(dept.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">{dept.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2">
                                    {dept.description || 'No description'}
                                </p>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                                        <Users className="w-4 h-4" />
                                        <span>{dept.managerName || 'No manager'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                                        <Wrench className="w-4 h-4" />
                                        <span>{dept.equipmentCount || 0} equipment</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-xl border dark:border-slate-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingDepartment ? 'Edit Department' : 'Add Department'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Manufacturing"
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field"
                                    rows={3}
                                    placeholder="Department description..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingDepartment ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Departments;
