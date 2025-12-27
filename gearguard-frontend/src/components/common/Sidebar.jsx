import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Wrench, Users, ClipboardList, Calendar,
    ChevronLeft, ChevronRight, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Sidebar({ isOpen, onToggle, userRole }) {
    const { logout, user } = useAuth();

    const getNavItems = () => {
        const baseUrl = `/${userRole.toLowerCase()}`;

        const allItems = {
            dashboard: { path: `${baseUrl}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
            equipment: { path: `${baseUrl}/equipment`, label: 'Equipment', icon: Wrench },
            teams: { path: `${baseUrl}/teams`, label: 'Teams', icon: Users },
            requests: { path: `${baseUrl}/requests`, label: 'Requests', icon: ClipboardList },
            calendar: { path: `${baseUrl}/calendar`, label: 'Calendar', icon: Calendar }
        };

        const roleItems = {
            ADMIN: ['dashboard', 'equipment', 'teams', 'requests', 'calendar'],
            MANAGER: ['dashboard', 'equipment', 'teams', 'requests', 'calendar'],
            TECHNICIAN: ['dashboard', 'requests', 'calendar'],
            USER: ['dashboard']
        };

        return (roleItems[userRole] || []).map(key => allItems[key]);
    };

    const navItems = getNavItems();

    return (
        <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-950 h-screen flex flex-col border-r border-gray-200 dark:border-slate-800 transition-all duration-300 shadow-lg relative`}>
            <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 dark:border-slate-800">
                {isOpen ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                            <Wrench className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">GearGuard</h1>
                            <p className="text-xs text-gray-500 dark:text-slate-500">{userRole}</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Wrench className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                            ${isActive
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium shadow-sm'
                                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                            }
                        `}
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? '' : 'mx-auto'}`} />
                        {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                        {!isOpen && (
                            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                {item.label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-3 border-t border-gray-200 dark:border-slate-800">
                {isOpen && user && (
                    <div className="px-4 py-3 mb-2">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500">{user.email || user.username}</p>
                    </div>
                )}
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200`}
                >
                    <LogOut className={`w-5 h-5 ${isOpen ? '' : 'mx-auto'}`} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>

            <button
                onClick={onToggle}
                className="absolute top-20 -right-3 w-6 h-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 shadow-md transition-all z-10"
            >
                {isOpen ? <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-slate-400" /> : <ChevronRight className="w-4 h-4 text-gray-600 dark:text-slate-400" />}
            </button>
        </aside>
    );
}

export default Sidebar;
