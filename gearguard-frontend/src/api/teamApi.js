import api from './axios';

export const teamApi = {
    getAll: () => api.get('/teams'),
    getById: (id) => api.get(`/teams/${id}`),
    create: (data) => api.post('/teams', data),
    update: (id, data) => api.put(`/teams/${id}`, data),
    delete: (id) => api.delete(`/teams/${id}`),
    getMembers: (id) => api.get(`/teams/${id}/members`),
    addMember: (id, data) => api.post(`/teams/${id}/members`, data),
    removeMember: (teamId, memberId) => api.delete(`/teams/${teamId}/members/${memberId}`),
    setTeamLead: (teamId, memberId) => api.put(`/teams/${teamId}/lead/${memberId}`)
};

export default teamApi;
