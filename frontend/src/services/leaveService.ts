import api from './api';
import { LeaveApplication, LeaveFormData } from '../types';

export const leaveService = {
  async applyLeave(data: LeaveFormData) {
    const response = await api.post('/leave/apply', data);
    return response.data;
  },

  async getMyApplications(): Promise<LeaveApplication[]> {
    const response = await api.get('/leave/my-applications');
    return response.data.data;
  },

  async getPendingApplications(): Promise<LeaveApplication[]> {
    const response = await api.get('/leave/pending');
    return response.data.data;
  },

  async getDepartmentApplications(): Promise<LeaveApplication[]> {
    const response = await api.get('/leave/department');
    return response.data.data;
  },

  async getAllApplications(filters?: any): Promise<LeaveApplication[]> {
    const response = await api.get('/leave/all', { params: filters });
    return response.data.data;
  },

  async approveLeave(id: string, comments?: string) {
    const response = await api.put(`/leave/${id}/approve`, { comments });
    return response.data;
  },

  async rejectLeave(id: string, comments?: string) {
    const response = await api.put(`/leave/${id}/reject`, { comments });
    return response.data;
  },
};
