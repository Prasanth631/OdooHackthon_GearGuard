import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Plus, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Clock, Repeat } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { requestApi } from '../../api/requestApi';
import api from '../../api/axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('month');
    const [events, setEvents] = useState([]);
    const [teams, setTeams] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [formData, setFormData] = useState({
        subject: '', description: '', equipmentId: '', type: 'PREVENTIVE', priority: 'MEDIUM',
        assignedTeamId: '', assignedToId: '', scheduledDate: '', estimatedDuration: '', notes: '',
        isRecurring: false, recurringInterval: 'WEEKLY'
    });

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        try {
            const [requestsRes, teamsRes, equipmentRes, usersRes] = await Promise.all([
                requestApi.getAll(),
                api.get('/teams'),
                api.get('/equipment'),
                api.get('/auth/users')
            ]);

            // Transform requests to calendar events
            const calendarEvents = requestsRes.data
                .filter(r => r.scheduledDate)
                .map(r => ({
                    id: r.id,
                    title: r.subject,
                    start: new Date(r.scheduledDate),
                    end: new Date(r.scheduledDate),
                    team: r.assignedTeamName,
                    color: r.assignedTeamColor || '#6366f1',
                    type: r.type,
                    priority: r.priority,
                    equipmentName: r.equipmentName,
                    isOverdue: r.isOverdue
                }));

            setEvents(calendarEvents);
            setTeams(teamsRes.data);
            setEquipment(equipmentRes.data);
            setUsers(usersRes.data.filter(u => u.role === 'TECHNICIAN' || u.role === 'MANAGER'));
        } catch (error) {
            console.error('Failed to load calendar data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSlot = ({ start }) => {
        setSelectedDate(start);
        setFormData(prev => ({ ...prev, scheduledDate: format(start, 'yyyy-MM-dd') }));
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        toast(`${event.title}\n${event.equipmentName}\nPriority: ${event.priority}`, { icon: '🔧' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                subject: formData.subject,
                description: formData.description,
                equipmentId: parseInt(formData.equipmentId),
                type: formData.type,
                priority: formData.priority,
                assignedTeamId: formData.assignedTeamId ? parseInt(formData.assignedTeamId) : null,
                assignedToId: formData.assignedToId ? parseInt(formData.assignedToId) : null,
                scheduledDate: formData.scheduledDate,
                estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : null,
                notes: formData.notes
            };

            await requestApi.create(submitData);
            toast.success('Maintenance scheduled successfully!');
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule');
        }
    };

    const resetForm = () => {
        setFormData({
            subject: '', description: '', equipmentId: '', type: 'PREVENTIVE', priority: 'MEDIUM',
            assignedTeamId: '', assignedToId: '', scheduledDate: '', estimatedDuration: '', notes: '',
            isRecurring: false, recurringInterval: 'WEEKLY'
        });
        setSelectedDate(null);
    };

    const eventStyleGetter = (event) => ({
        style: {
            backgroundColor: event.isOverdue ? '#ef4444' : event.color,
            borderRadius: '6px',
            opacity: 0.9,
            color: 'white',
            border: '0px',
            padding: '2px 6px',
            fontSize: '12px'
        }
    });

    const components = {
        toolbar: ({ date, onNavigate, onView, view }) => (
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('PREV')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-slate-300" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white min-w-[180px] text-center">
                        {format(date, view === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
                    </h2>
                    <button onClick={() => onNavigate('NEXT')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-slate-300" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                        {['month', 'week', 'day'].map(v => (
                            <button
                                key={v}
                                onClick={() => onView(v)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === v
                                        ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {v.charAt(0).toUpperCase() + v.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => onNavigate('TODAY')} className="btn-secondary">Today</button>
                </div>
            </div>
        ),
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
                    <h1 className="page-title">Maintenance Calendar</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">View and schedule preventive maintenance</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Schedule Maintenance
                </button>
            </div>

            {/* Team Legend */}
            <div className="flex flex-wrap gap-4">
                {teams.map(team => (
                    <div key={team.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                        <span className="text-sm text-gray-600 dark:text-slate-400">{team.name}</span>
                    </div>
                ))}
            </div>

            {/* Calendar */}
            <div className="card h-[calc(100vh-280px)] calendar-dark-mode">
                <style>{`
                    .calendar-dark-mode .rbc-calendar { color: inherit; }
                    .dark .calendar-dark-mode .rbc-header {
                        background-color: #1e293b; color: #e2e8f0; border-bottom: 1px solid #334155; padding: 8px 0;
                    }
                    .dark .calendar-dark-mode .rbc-month-view, .dark .calendar-dark-mode .rbc-time-view, .dark .calendar-dark-mode .rbc-agenda-view {
                        background-color: #0f172a; border: 1px solid #334155;
                    }
                    .dark .calendar-dark-mode .rbc-day-bg { background-color: #0f172a; }
                    .dark .calendar-dark-mode .rbc-off-range-bg { background-color: #020617; }
                    .dark .calendar-dark-mode .rbc-today { background-color: rgba(59, 130, 246, 0.15); }
                    .dark .calendar-dark-mode .rbc-month-row, .dark .calendar-dark-mode .rbc-day-bg + .rbc-day-bg,
                    .dark .calendar-dark-mode .rbc-header + .rbc-header, .dark .calendar-dark-mode .rbc-time-content,
                    .dark .calendar-dark-mode .rbc-timeslot-group { border-color: #334155; }
                    .dark .calendar-dark-mode .rbc-date-cell { color: #e2e8f0; padding: 4px 8px; }
                    .dark .calendar-dark-mode .rbc-date-cell.rbc-off-range { color: #475569; }
                    .dark .calendar-dark-mode .rbc-button-link { color: #e2e8f0; }
                    .dark .calendar-dark-mode .rbc-show-more { color: #60a5fa; background: transparent; }
                    .dark .calendar-dark-mode .rbc-time-header, .dark .calendar-dark-mode .rbc-time-content > * + * > * {
                        border-color: #334155;
                    }
                    .dark .calendar-dark-mode .rbc-time-slot { border-color: #1e293b; }
                    .dark .calendar-dark-mode .rbc-label { color: #94a3b8; }
                    .dark .calendar-dark-mode .rbc-current-time-indicator { background-color: #ef4444; }
                    .calendar-dark-mode .rbc-header { font-weight: 600; font-size: 13px; text-transform: uppercase; }
                `}</style>
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    components={components}
                    date={currentDate}
                    view={currentView}
                    onNavigate={setCurrentDate}
                    onView={setCurrentView}
                    views={['month', 'week', 'day']}
                    popup
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                />
            </div>

            {/* Schedule Maintenance Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg my-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-primary-500" /> Schedule Maintenance
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Subject *</label>
                                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" placeholder="e.g., Monthly inspection" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Equipment *</label>
                                    <select value={formData.equipmentId} onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" required>
                                        <option value="">Select...</option>
                                        {equipment.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Date *</label>
                                    <input type="date" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <option value="PREVENTIVE">Preventive</option>
                                        <option value="CORRECTIVE">Corrective</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="CRITICAL">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Team</label>
                                    <select value={formData.assignedTeamId} onChange={(e) => setFormData({ ...formData, assignedTeamId: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                                        <option value="">None</option>
                                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (hours)</label>
                                    <input type="number" value={formData.estimatedDuration} onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" placeholder="e.g., 2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl" rows="2" placeholder="Additional instructions..." />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">Schedule</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Calendar;
