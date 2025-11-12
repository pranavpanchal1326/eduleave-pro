import api from './api';
import { Notification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data.data;
  },

  async markAsRead(id: string) {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};
