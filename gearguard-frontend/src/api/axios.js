import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

export const equipmentApi = {
    getAll: () => api.get('/equipment'),
    getById: (id) => api.get(`/equipment/${id}`),
    create: (data) => api.post('/equipment', data),
    update: (id, data) => api.put(`/equipment/${id}`, data),
    delete: (id) => api.delete(`/equipment/${id}`),
    getRequestCount: (id) => api.get(`/equipment/${id}/requests/count`)
};

export const teamApi = {
    getAll: () => api.get('/teams'),
    getById: (id) => api.get(`/teams/${id}`),
    create: (data) => api.post('/teams', data),
    update: (id, data) => api.put(`/teams/${id}`, data),
    delete: (id) => api.delete(`/teams/${id}`),
    getMembers: (id) => api.get(`/teams/${id}/members`),
    addMember: (id, data) => api.post(`/teams/${id}/members`, data)
};

export const requestApi = {
    getAll: () => api.get('/requests'),
    getKanban: () => api.get('/requests/kanban'),
    getCalendar: (start, end) => api.get('/requests/calendar', { params: { start, end } }),
    getById: (id) => api.get(`/requests/${id}`),
    create: (data) => api.post('/requests', data),
    update: (id, data) => api.put(`/requests/${id}`, data),
    updateStage: (id, stage) => api.patch(`/requests/${id}/stage`, { stage }),
    delete: (id) => api.delete(`/requests/${id}`)
};

export const dashboardApi = {
    getStats: () => api.get('/dashboard/stats'),
    getChartsByTeam: () => api.get('/dashboard/charts/by-team'),
    getChartsByCategory: () => api.get('/dashboard/charts/by-category'),
    getRecent: () => api.get('/dashboard/recent')
};

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    getCurrentUser: () => api.get('/auth/me'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
    resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword })
};
