import { Sun, Moon, Bell, Search, Menu, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils';

function Navbar({ darkMode, onToggleDarkMode, onToggleSidebar }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notifications = [
        { id: 1, message: 'New maintenance request submitted', time: '5 min ago', unread: true },
        { id: 2, message: 'CNC Machine repair completed', time: '1 hour ago', unread: true },
        { id: 3, message: 'Scheduled maintenance tomorrow', time: '2 hours ago', unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 lg:w-80 pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder-gray-400 dark:placeholder-slate-500 text-gray-900 dark:text-gray-100"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleDarkMode}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 transition-all group border border-transparent dark:border-slate-800"
                >
                    {darkMode ? (
                        <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600 group-hover:-rotate-12 transition-transform duration-300" />
                    )}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 transition-all relative border border-transparent dark:border-slate-800"
                    >
                        <Bell className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 py-2 z-50 animate-slide-down">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            </div>
                            {notifications.map((notif) => (
                                <div key={notif.id} className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer ${notif.unread ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{notif.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{notif.time}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 transition-all border border-transparent dark:border-slate-800"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                            {getInitials(user?.fullName)}
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-slate-300">
                            {user?.fullName || 'User'}
                        </span>
                    </button>
                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 py-2 z-50 animate-slide-down">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-800">
                                <p className="font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">{user?.role}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigate(`/${user?.role?.toLowerCase()}/profile`);
                                    setShowProfile(false);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center gap-3"
                            >
                                <Settings className="w-4 h-4" /> My Profile
                            </button>
                            <button onClick={logout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3">
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
