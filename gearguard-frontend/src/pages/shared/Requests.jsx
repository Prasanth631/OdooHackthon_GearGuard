import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, User, AlertTriangle, Wrench, X, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { requestApi } from '../../api/requestApi';
import api from '../../api/axios';
import ConfirmDialog from '../../components/common/ConfirmDialog';

function Requests() {
    const columns = {
        NEW: { title: 'New', color: '#6366f1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
        IN_PROGRESS: { title: 'In Progress', color: '#f59e0b', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
        REPAIRED: { title: 'Repaired', color: '#10b981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        SCRAP: { title: 'Scrap', color: '#6b7280', bgColor: 'bg-gray-100 dark:bg-gray-700/50' },
    };

    const [requests, setRequests] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRequest, setEditingRequest] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });
    const [formData, setFormData] = useState({
        subject: '', description: '', equipmentId: '', type: 'CORRECTIVE', priority: 'MEDIUM',
        assignedTeamId: '', assignedToId: '', scheduledDate: '', estimatedDuration: '', notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requestsRes, equipmentRes, teamsRes, usersRes] = await Promise.all([
                requestApi.getAll(),
                api.get('/equipment'),
                api.get('/teams'),
                api.get('/auth/users')
            ]);
            setRequests(requestsRes.data);
            setEquipment(equipmentRes.data);
            setTeams(teamsRes.data);
            setUsers(usersRes.data.filter(u => u.role === 'TECHNICIAN' || u.role === 'MANAGER'));
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || destination.droppableId === source.droppableId) return;

        // Optimistic update
        setRequests(prev => prev.map(req =>
            req.id.toString() === draggableId ? { ...req, stage: destination.droppableId } : req
        ));

        try {
            await requestApi.updateStage(parseInt(draggableId), destination.droppableId);
            toast.success(`Request moved to ${columns[destination.droppableId].title}`);
        } catch (error) {
            // Revert on error
            fetchData();
            toast.error('Failed to update status');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                equipmentId: parseInt(formData.equipmentId),
                assignedTeamId: formData.assignedTeamId ? parseInt(formData.assignedTeamId) : null,
                assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : null,
                estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : null
            };

            if (editingRequest) {
                await requestApi.update(editingRequest.id, submitData);
                toast.success('Request updated');
            } else {
                await requestApi.create(submitData);
                toast.success('Request created');
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (request) => {
        setEditingRequest(request);
        setFormData({
            subject: request.subject,
            description: request.description || '',
            equipmentId: request.equipmentId?.toString() || '',
            type: request.type,
            priority: request.priority,
            assignedTeamId: request.assignedTeamId?.toString() || '',
            assignedToId: request.assignedToId?.toString() || '',
            scheduledDate: request.scheduledDate || '',
            estimatedDuration: request.estimatedDuration?.toString() || '',
            notes: request.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Request',
            message: 'Are you sure you want to delete this maintenance request?',
            onConfirm: async () => {
                try {
                    await requestApi.delete(id);
                    toast.success('Request deleted');
                    fetchData();
                } catch (error) {
                    toast.error('Failed to delete');
                }
            }
        });
    };

    // Auto-fill team when equipment is selected (Flow 1: The Breakdown requirement)
    const handleEquipmentChange = (e) => {
        const equipmentId = e.target.value;
        setFormData(prev => ({ ...prev, equipmentId }));

        // Find the selected equipment and auto-fill the team
        const selectedEquipment = equipment.find(eq => eq.id.toString() === equipmentId);
        if (selectedEquipment && selectedEquipment.maintenanceTeamId) {
            setFormData(prev => ({
                ...prev,
                equipmentId,
                assignedTeamId: selectedEquipment.maintenanceTeamId.toString()
            }));
        }
    };

    const resetForm = () => {
        setEditingRequest(null);
        setFormData({
            subject: '', description: '', equipmentId: '', type: 'CORRECTIVE', priority: 'MEDIUM',
            assignedTeamId: '', assignedToId: '', scheduledDate: '', estimatedDuration: '', notes: ''
        });
    };

    const getPriorityColor = (priority) => {
        const colors = { LOW: 'bg-gray-200 text-gray-700', MEDIUM: 'bg-blue-100 text-blue-700', HIGH: 'bg-orange-100 text-orange-700', CRITICAL: 'bg-red-100 text-red-700 animate-pulse' };
        return colors[priority] || colors.MEDIUM;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="page-title">Maintenance Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Drag and drop to update status</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> New Request
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
                    {Object.entries(columns).map(([columnId, column]) => (
                        <div key={columnId} className="flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{column.title}</h3>
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                                        {requests.filter(r => r.stage === columnId).length}
                                    </span>
                                </div>
                            </div>
                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 p-3 rounded-xl ${column.bgColor} overflow-y-auto ${snapshot.isDraggingOver ? 'ring-2 ring-primary-500' : ''}`}>
                                        {requests.filter(r => r.stage === columnId).map((request, index) => (
                                            <Draggable key={request.id.toString()} draggableId={request.id.toString()} index={index}>
                                                {(provided) => (
                                                    <motion.div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                        className={`kanban-card group ${request.isOverdue ? 'border-l-red-500 pulse-overdue' : ''}`}
                                                        style={{ borderLeftColor: request.isOverdue ? '#ef4444' : column.color, ...provided.draggableProps.style }}>

                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEdit(request)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                                                                <Edit className="w-3 h-3 text-gray-500" />
                                                            </button>
                                                            <button onClick={() => handleDelete(request.id)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                                                                <Trash2 className="w-3 h-3 text-red-500" />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={`badge ${getPriorityColor(request.priority)}`}>{request.priority}</span>
                                                            {request.isOverdue && <span className="flex items-center gap-1 text-xs text-red-600"><AlertTriangle className="w-3 h-3" /> Overdue</span>}
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm pr-12">{request.subject}</h4>
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500"><Wrench className="w-3 h-3" />{request.equipmentName}</div>

                                                        {request.scheduledDate && (
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                                                <Calendar className="w-3 h-3" /> {request.scheduledDate}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                            <span className={`text-xs px-2 py-0.5 rounded ${request.type === 'CORRECTIVE' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>{request.type}</span>
                                                            {request.assignedToName ? (
                                                                <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium" title={request.assignedToName}>
                                                                    {request.assignedToName.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                            ) : (
                                                                <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                                    <User className="w-4 h-4 text-gray-500" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {/* Create/Edit Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg my-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingRequest ? 'Edit Request' : 'New Maintenance Request'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" rows="2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment *</label>
                                    <select value={formData.equipmentId} onChange={handleEquipmentChange} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" required>
                                        <option value="">Select...</option>
                                        {equipment.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <option value="CORRECTIVE">Corrective</option>
                                        <option value="PREVENTIVE">Preventive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Date</label>
                                    <input type="date" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to Team</label>
                                    <select value={formData.assignedTeamId} onChange={(e) => setFormData({ ...formData, assignedTeamId: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <option value="">None</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign to User</label>
                                    <select value={formData.assignedToId} onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <option value="">None</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" rows="2" placeholder="Additional notes..." />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">{editingRequest ? 'Update' : 'Create'} Request</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type="danger"
            />
        </div>
    );
}

export default Requests;
