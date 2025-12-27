import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const events = [
        { id: 1, title: 'CNC Machine Monthly Check', start: new Date(2024, 11, 28), end: new Date(2024, 11, 28), team: 'Mechanics', color: '#ef4444' },
        { id: 2, title: 'Server Maintenance', start: new Date(2024, 11, 30), end: new Date(2024, 11, 30), team: 'IT Support', color: '#3b82f6' },
        { id: 3, title: 'Forklift Inspection', start: new Date(2025, 0, 2), end: new Date(2025, 0, 2), team: 'Mechanics', color: '#ef4444' },
        { id: 4, title: 'HVAC Filter Change', start: new Date(2025, 0, 5), end: new Date(2025, 0, 5), team: 'HVAC', color: '#10b981' },
    ];

    const eventStyleGetter = (event) => ({
        style: { backgroundColor: event.color, borderRadius: '6px', opacity: 0.9, color: 'white', border: '0px', padding: '2px 6px', fontSize: '12px' }
    });

    const components = {
        toolbar: ({ date, onNavigate }) => (
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('PREV')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-slate-300" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{format(date, 'MMMM yyyy')}</h2>
                    <button onClick={() => onNavigate('NEXT')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-slate-300" />
                    </button>
                </div>
                <button onClick={() => onNavigate('TODAY')} className="btn-secondary">Today</button>
            </div>
        ),
    };

    return (
        <div className="space-y-6 h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="page-title">Maintenance Calendar</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">View and schedule preventive maintenance</p>
                </div>
                <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Schedule Maintenance</button>
            </div>

            <div className="flex flex-wrap gap-4">
                {[{ name: 'Mechanics', color: '#ef4444' }, { name: 'IT Support', color: '#3b82f6' }, { name: 'HVAC', color: '#10b981' }, { name: 'Electricians', color: '#f59e0b' }].map(team => (
                    <div key={team.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                        <span className="text-sm text-gray-600 dark:text-slate-400">{team.name}</span>
                    </div>
                ))}
            </div>

            <div className="card h-[calc(100vh-280px)] calendar-dark-mode">
                <style>{`
                    .calendar-dark-mode .rbc-calendar {
                        color: inherit;
                    }
                    .dark .calendar-dark-mode .rbc-header {
                        background-color: #1e293b;
                        color: #e2e8f0;
                        border-bottom: 1px solid #334155;
                        padding: 8px 0;
                    }
                    .dark .calendar-dark-mode .rbc-month-view,
                    .dark .calendar-dark-mode .rbc-time-view {
                        background-color: #0f172a;
                        border: 1px solid #334155;
                    }
                    .dark .calendar-dark-mode .rbc-day-bg {
                        background-color: #0f172a;
                    }
                    .dark .calendar-dark-mode .rbc-off-range-bg {
                        background-color: #020617;
                    }
                    .dark .calendar-dark-mode .rbc-today {
                        background-color: rgba(59, 130, 246, 0.15);
                    }
                    .dark .calendar-dark-mode .rbc-month-row,
                    .dark .calendar-dark-mode .rbc-day-bg + .rbc-day-bg,
                    .dark .calendar-dark-mode .rbc-header + .rbc-header {
                        border-color: #334155;
                    }
                    .dark .calendar-dark-mode .rbc-date-cell {
                        color: #e2e8f0;
                        padding: 4px 8px;
                    }
                    .dark .calendar-dark-mode .rbc-date-cell.rbc-off-range {
                        color: #475569;
                    }
                    .dark .calendar-dark-mode .rbc-button-link {
                        color: #e2e8f0;
                    }
                    .dark .calendar-dark-mode .rbc-show-more {
                        color: #60a5fa;
                        background: transparent;
                    }
                    .calendar-dark-mode .rbc-header {
                        font-weight: 600;
                        font-size: 13px;
                        text-transform: uppercase;
                    }
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
                    onNavigate={setCurrentDate}
                    views={['month', 'week', 'day']}
                    popup
                    selectable
                />
            </div>
        </div>
    );
}

export default Calendar;
