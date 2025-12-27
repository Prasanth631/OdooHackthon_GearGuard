import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Wrench, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setEmailSent(true);
            toast.success('Password reset email sent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary-500/30">
                        <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">GearGuard</h1>
                </div>

                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-slate-800 p-8 shadow-2xl">
                    {!emailSent ? (
                        <>
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
                                <p className="text-gray-500 dark:text-slate-400 mt-2">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={inputClasses}
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Check Your Email</h3>
                            <p className="text-gray-500 dark:text-slate-400 mb-6">
                                We've sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>
                            </p>
                            <p className="text-sm text-gray-400 dark:text-slate-500">
                                Didn't receive it? Check your spam folder or try again.
                            </p>
                        </motion.div>
                    )}

                    <button
                        onClick={() => navigate('/login')}
                        className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-600">
                    © 2025 GearGuard. Built for Odoo Hackathon.
                </p>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;
