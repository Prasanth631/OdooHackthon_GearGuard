import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, User, Clock, Filter, RefreshCw, Search, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';

function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [expandedLog, setExpandedLog] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/audit-logs', { params: { page, size: 30 } });
            setLogs(response.data.logs || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Failed to load audit logs', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action) => {
        const colors = {
            CREATE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            UPLOAD: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            LOGIN: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
            LOGOUT: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        };
        return colors[action] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Audit Logs</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Track all system activity and changes</p>
                </div>
                <button onClick={fetchLogs} className="btn-secondary flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            <div className="card">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No audit logs found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-slate-700">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Time</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Action</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Entity</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">User</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Details</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, index) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(log.createdAt)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`badge ${getActionColor(log.action)}`}>{log.action}</span>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className="font-medium text-gray-900 dark:text-white">{log.entityType}</span>
                                                {log.entityId && <span className="text-gray-500 ml-1">#{log.entityId}</span>}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-primary-600" />
                                                    </div>
                                                    <span className="text-sm text-gray-700 dark:text-slate-300">
                                                        {log.performedBy?.fullName || 'System'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-slate-400 max-w-xs truncate">
                                                {log.details || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {(log.oldValue || log.newValue) && (
                                                    <button
                                                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                                                        className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                                                    >
                                                        {expandedLog === log.id ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600 dark:text-slate-400">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AuditLogs;
