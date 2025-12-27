import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import TechnicianDashboard from './pages/technician/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import Equipment from './pages/shared/Equipment';
import Teams from './pages/shared/Teams';
import Requests from './pages/shared/Requests';
import Calendar from './pages/shared/Calendar';
import Profile from './pages/shared/Profile';

function AppContent() {
    const { isAuthenticated, user, loading } = useAuth();
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) return JSON.parse(saved);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const getDashboardRoute = () => {
        if (!user) return '/login';
        const routes = {
            ADMIN: '/admin/dashboard',
            MANAGER: '/manager/dashboard',
            TECHNICIAN: '/technician/dashboard',
            USER: '/user/dashboard'
        };
        return routes[user.role] || '/login';
    };

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: darkMode ? '#0f172a' : '#fff',
                        color: darkMode ? '#f1f5f9' : '#1e293b',
                        border: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    }
                }}
            />

            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Login />
                } />

                <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
                            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} userRole="ADMIN" />
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
                                    <Routes>
                                        <Route path="dashboard" element={<AdminDashboard />} />
                                        <Route path="equipment" element={<Equipment />} />
                                        <Route path="teams" element={<Teams />} />
                                        <Route path="requests" element={<Requests />} />
                                        <Route path="calendar" element={<Calendar />} />
                                        <Route path="profile" element={<Profile />} />
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="/manager/*" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                        <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
                            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} userRole="MANAGER" />
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
                                    <Routes>
                                        <Route path="dashboard" element={<ManagerDashboard />} />
                                        <Route path="equipment" element={<Equipment />} />
                                        <Route path="teams" element={<Teams />} />
                                        <Route path="requests" element={<Requests />} />
                                        <Route path="calendar" element={<Calendar />} />
                                        <Route path="profile" element={<Profile />} />
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="/technician/*" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'TECHNICIAN']}>
                        <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
                            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} userRole="TECHNICIAN" />
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
                                    <Routes>
                                        <Route path="dashboard" element={<TechnicianDashboard />} />
                                        <Route path="requests" element={<Requests />} />
                                        <Route path="calendar" element={<Calendar />} />
                                        <Route path="profile" element={<Profile />} />
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="/user/*" element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'TECHNICIAN', 'USER']}>
                        <div className="flex h-screen bg-gray-100 dark:bg-slate-950">
                            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} userRole="USER" />
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <Navbar darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
                                    <Routes>
                                        <Route path="dashboard" element={<UserDashboard />} />
                                        <Route path="profile" element={<Profile />} />
                                    </Routes>
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                } />

                <Route path="/" element={<Navigate to={isAuthenticated ? getDashboardRoute() : '/login'} replace />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? getDashboardRoute() : '/login'} replace />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
