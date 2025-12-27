import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, User, AlertTriangle, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

function Requests() {
    const columns = {
        NEW: { title: 'New', color: '#6366f1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
        IN_PROGRESS: { title: 'In Progress', color: '#f59e0b', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
        REPAIRED: { title: 'Repaired', color: '#10b981', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        SCRAP: { title: 'Scrap', color: '#6b7280', bgColor: 'bg-gray-100 dark:bg-gray-700/50' },
    };

    const [requests, setRequests] = useState([
        { id: '1', subject: 'CNC Machine oil leak', equipment: 'CNC Machine Alpha', priority: 'HIGH', stage: 'NEW', assignee: 'John Smith', isOverdue: true, type: 'CORRECTIVE' },
        { id: '2', subject: 'Routine inspection', equipment: 'Forklift #3', priority: 'MEDIUM', stage: 'NEW', assignee: null, isOverdue: false, type: 'PREVENTIVE' },
        { id: '3', subject: 'Network issues', equipment: 'Main Server', priority: 'CRITICAL', stage: 'IN_PROGRESS', assignee: 'Alex Chen', isOverdue: false, type: 'CORRECTIVE' },
        { id: '4', subject: 'Printer paper jam', equipment: 'Office Printer', priority: 'LOW', stage: 'IN_PROGRESS', assignee: 'Mike Johnson', isOverdue: false, type: 'CORRECTIVE' },
        { id: '5', subject: 'Motor replacement', equipment: '3D Printer Pro', priority: 'HIGH', stage: 'REPAIRED', assignee: 'Sarah Williams', isOverdue: false, type: 'CORRECTIVE' },
    ]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || destination.droppableId === source.droppableId) return;
        setRequests(prev => prev.map(req => req.id === draggableId ? { ...req, stage: destination.droppableId } : req));
        toast.success(`Request moved to ${columns[destination.droppableId].title}`);
    };

    const getPriorityColor = (priority) => {
        const colors = { LOW: 'bg-gray-200 text-gray-700', MEDIUM: 'bg-blue-100 text-blue-700', HIGH: 'bg-orange-100 text-orange-700', CRITICAL: 'bg-red-100 text-red-700 animate-pulse' };
        return colors[priority] || colors.MEDIUM;
    };

    return (
        <div className="space-y-6 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="page-title">Maintenance Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Drag and drop to update status</p>
                </div>
                <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> New Request</button>
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
                                            <Draggable key={request.id} draggableId={request.id} index={index}>
                                                {(provided) => (
                                                    <motion.div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                        className={`kanban-card ${request.isOverdue ? 'border-l-red-500 pulse-overdue' : ''}`}
                                                        style={{ borderLeftColor: request.isOverdue ? '#ef4444' : column.color, ...provided.draggableProps.style }}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className={`badge ${getPriorityColor(request.priority)}`}>{request.priority}</span>
                                                            {request.isOverdue && <span className="flex items-center gap-1 text-xs text-red-600"><AlertTriangle className="w-3 h-3" /> Overdue</span>}
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{request.subject}</h4>
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500"><Wrench className="w-3 h-3" />{request.equipment}</div>
                                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                            <span className={`text-xs px-2 py-0.5 rounded ${request.type === 'CORRECTIVE' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>{request.type}</span>
                                                            {request.assignee ? (
                                                                <div className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium" title={request.assignee}>{request.assignee.split(' ').map(n => n[0]).join('')}</div>
                                                            ) : (
                                                                <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-gray-500" /></div>
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
        </div>
    );
}

export default Requests;
