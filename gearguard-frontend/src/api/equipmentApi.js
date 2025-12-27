import api from './axios';

export const equipmentApi = {
    getAll: (params = {}) => api.get('/equipment', { params }),
    getById: (id) => api.get(`/equipment/${id}`),
    create: (data) => api.post('/equipment', data),
    update: (id, data) => api.put(`/equipment/${id}`, data),
    delete: (id) => api.delete(`/equipment/${id}`),
    getCategories: () => api.get('/equipment/categories'),
    getStatuses: () => api.get('/equipment/statuses'),
};

export default equipmentApi;
