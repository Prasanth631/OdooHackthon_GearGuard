import api from './axios';

export const requestApi = {
    getAll: () => api.get('/requests'),
    getById: (id) => api.get(`/requests/${id}`),
    create: (data) => api.post('/requests', data),
    update: (id, data) => api.put(`/requests/${id}`, data),
    updateStage: (id, stage) => api.patch(`/requests/${id}/stage`, { stage }),
    delete: (id) => api.delete(`/requests/${id}`),
    getByStage: (stage) => api.get(`/requests/stage/${stage}`),
    getByTeam: (teamId) => api.get(`/requests/team/${teamId}`),
    getOverdue: () => api.get('/requests/overdue')
};

export default requestApi;
