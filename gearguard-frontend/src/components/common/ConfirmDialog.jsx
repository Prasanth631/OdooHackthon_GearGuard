import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            icon: 'bg-red-100 dark:bg-red-900/30 text-red-600',
            button: 'bg-red-600 hover:bg-red-700 text-white',
            iconComponent: <Trash2 className="w-6 h-6" />
        },
        warning: {
            icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 text-white',
            iconComponent: <AlertTriangle className="w-6 h-6" />
        }
    };

    const colorConfig = colors[type] || colors.danger;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${colorConfig.icon}`}>
                            {colorConfig.iconComponent}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${colorConfig.button}`}
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default ConfirmDialog;
