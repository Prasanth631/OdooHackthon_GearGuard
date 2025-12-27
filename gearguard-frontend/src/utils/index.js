export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatDateTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

export const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
};

export const getPriorityColor = (priority) => {
    const colors = {
        LOW: 'bg-gray-200 text-gray-700',
        MEDIUM: 'bg-blue-100 text-blue-700',
        HIGH: 'bg-orange-100 text-orange-700',
        CRITICAL: 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors.MEDIUM;
};

export const getStatusColor = (status) => {
    const colors = {
        ACTIVE: 'bg-green-100 text-green-700',
        MAINTENANCE: 'bg-amber-100 text-amber-700',
        INACTIVE: 'bg-gray-100 text-gray-700',
        SCRAPPED: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.ACTIVE;
};
