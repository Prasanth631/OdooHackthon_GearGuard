import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, Download, Wrench, ClipboardList, Loader2, Calendar, Users } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function Reports() {
    const [downloading, setDownloading] = useState({});

    const handleDownload = async (endpoint, filename, type) => {
        const key = `${endpoint}-${type}`;
        setDownloading(prev => ({ ...prev, [key]: true }));

        try {
            const response = await api.get(endpoint, { responseType: 'blob' });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success(`${type} downloaded successfully!`);
        } catch (error) {
            toast.error('Failed to download report. Please try again.');
            console.error('Download error:', error);
        } finally {
            setDownloading(prev => ({ ...prev, [key]: false }));
        }
    };

    const reportCards = [
        {
            title: 'Equipment Inventory',
            description: 'Complete list of all equipment with details like serial number, location, category, and status.',
            icon: Wrench,
            gradient: 'from-blue-500 to-indigo-600',
            pdfEndpoint: '/reports/equipment/pdf',
            excelEndpoint: '/reports/equipment/excel',
            pdfFilename: `equipment_inventory_${new Date().toISOString().split('T')[0]}.pdf`,
            excelFilename: `equipment_inventory_${new Date().toISOString().split('T')[0]}.xlsx`
        },
        {
            title: 'Maintenance History',
            description: 'All maintenance requests with status, priority, assigned team, scheduled dates, and completion details.',
            icon: ClipboardList,
            gradient: 'from-amber-500 to-orange-600',
            pdfEndpoint: '/reports/maintenance/pdf',
            excelEndpoint: '/reports/maintenance/excel',
            pdfFilename: `maintenance_history_${new Date().toISOString().split('T')[0]}.pdf`,
            excelFilename: `maintenance_history_${new Date().toISOString().split('T')[0]}.xlsx`
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Reports</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Generate and download PDF/Excel reports</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reportCards.map((report, index) => (
                    <motion.div
                        key={report.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card overflow-hidden"
                    >
                        <div className={`h-2 bg-gradient-to-r ${report.gradient}`}></div>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 bg-gradient-to-br ${report.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                    <report.icon className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{report.title}</h2>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{report.description}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                <button
                                    onClick={() => handleDownload(report.pdfEndpoint, report.pdfFilename, 'PDF')}
                                    disabled={downloading[`${report.pdfEndpoint}-PDF`]}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium disabled:opacity-50"
                                >
                                    {downloading[`${report.pdfEndpoint}-PDF`] ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <FileText className="w-5 h-5" />
                                    )}
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => handleDownload(report.excelEndpoint, report.excelFilename, 'Excel')}
                                    disabled={downloading[`${report.excelEndpoint}-Excel`]}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors font-medium disabled:opacity-50"
                                >
                                    {downloading[`${report.excelEndpoint}-Excel`] ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <FileSpreadsheet className="w-5 h-5" />
                                    )}
                                    Download Excel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-5 h-5 text-red-500" />
                            <span className="font-medium text-gray-900 dark:text-white">PDF Reports</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Professional formatted documents ideal for printing and sharing with stakeholders.
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <FileSpreadsheet className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-gray-900 dark:text-white">Excel Reports</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Full data exports with all fields for further analysis and data processing.
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-gray-900 dark:text-white">Auto-dated Filenames</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            All downloads include today's date for easy organization and tracking.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Reports;
