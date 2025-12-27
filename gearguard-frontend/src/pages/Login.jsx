import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Mail, Lock, Eye, EyeOff, User, Sun, Moon, Settings, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [adminExists, setAdminExists] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) return JSON.parse(saved);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        username: ''
    });

    const { login, setupAdmin, checkAdminExists, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const exists = await checkAdminExists();
                setAdminExists(exists);
                if (!exists) setIsLogin(false);
            } catch (error) {
                console.error('Error checking admin');
            }
        };
        checkAdmin();
    }, []);

    useEffect(() => {
        if (isAuthenticated && user) {
            const dashboardRoutes = {
                ADMIN: '/admin/dashboard',
                MANAGER: '/manager/dashboard',
                TECHNICIAN: '/technician/dashboard',
                USER: '/user/dashboard'
            };
            navigate(dashboardRoutes[user.role] || '/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Welcome back!');
            } else {
                await setupAdmin({
                    username: formData.username || formData.email.split('@')[0],
                    password: formData.password,
                    fullName: formData.fullName,
                    email: formData.email,
                    role: 'ADMIN'
                });
                toast.success('Admin account created!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const floatingElements = [
        { icon: Settings, delay: 0, x: '10%', y: '20%' },
        { icon: Shield, delay: 0.5, x: '85%', y: '15%' },
        { icon: Zap, delay: 1, x: '15%', y: '75%' },
        { icon: Wrench, delay: 1.5, x: '80%', y: '70%' },
    ];

    const inputClasses = "w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-6 right-6 z-50 p-3 rounded-xl bg-white/80 dark:bg-slate-800/50 backdrop-blur-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all group shadow-lg"
            >
                {darkMode ? (
                    <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
                ) : (
                    <Moon className="w-5 h-5 text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
                )}
            </button>

            {floatingElements.map((el, index) => (
                <motion.div
                    key={index}
                    className="absolute hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-lg"
                    style={{ left: el.x, top: el.y }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4,
                        delay: el.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <el.icon className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                </motion.div>
            ))}

            <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative">
                <div className="relative">
                    <motion.div
                        className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-400/30 dark:from-primary-600/20 to-purple-400/30 dark:to-purple-600/20 blur-3xl absolute -top-20 -left-20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="w-60 h-60 rounded-full bg-gradient-to-br from-cyan-400/30 dark:from-cyan-600/20 to-primary-400/30 dark:to-primary-600/20 blur-3xl absolute -bottom-10 -right-10"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                        style={{ perspective: '1000px' }}
                    >
                        <motion.div
                            className="w-72 h-72 bg-gradient-to-br from-white/90 dark:from-slate-800/80 to-gray-100/90 dark:to-slate-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center shadow-2xl"
                            animate={{ rotateY: [0, 5, 0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <motion.div
                                className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30"
                                animate={{ rotateZ: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Wrench className="w-12 h-12 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-6 tracking-tight">GearGuard</h1>
                            <p className="text-gray-500 dark:text-slate-400 mt-2 text-center">The Ultimate Maintenance Tracker</p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary-500/30">
                            <Wrench className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">GearGuard</h1>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-slate-800 p-8 shadow-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isLogin ? 'Welcome Back' : 'Create Admin Account'}
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400 mt-2">
                                {isLogin ? 'Sign in to continue to your dashboard' : 'Set up your admin account to get started'}
                            </p>
                        </div>

                        {!adminExists && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/30"
                            >
                                <p className="text-sm text-amber-700 dark:text-amber-300 text-center">
                                    ⚡ No admin account exists. Create one to get started.
                                </p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className={inputClasses}
                                            placeholder="John Doe"
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={inputClasses}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className={`${inputClasses} pr-12`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {isLogin && (
                                    <div className="mt-2 text-right">
                                        <button
                                            type="button"
                                            onClick={() => navigate('/forgot-password')}
                                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        {isLogin ? 'Signing in...' : 'Creating Account...'}
                                    </span>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Admin Account'
                                )}
                            </motion.button>
                        </form>

                        {adminExists && (
                            <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-500">
                                Need an account? Contact your administrator.
                            </p>
                        )}
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-600">
                        © 2025 GearGuard. Built for Odoo Hackathon.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default Login;
