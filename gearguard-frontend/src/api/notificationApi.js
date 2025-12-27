import api from './axios';

export const notificationApi = {
    getAll: () => api.get('/notifications'),
    getUnread: () => api.get('/notifications/unread'),
    getCount: () => api.get('/notifications/count'),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all')
};

export default notificationApi;
