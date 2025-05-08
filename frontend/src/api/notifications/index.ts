import api from '../apiClient';
import { NotificationBell } from 'src/components/notifications';

export interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: 'info' | 'success' | 'warning' | 'error';
  channel: 'email' | 'in_app' | 'push';
  status: 'pending' | 'sent' | 'failed';
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  content_type?: string;
  object_id?: number;
  post_id?: number;
}

export interface NotificationCount {
  count: number;
}

export const notificationsApi = {
  getNotifications: () => 
    api.get<Notification[]>('/notifications/'),
  
  getUnreadNotifications: () => 
    api.get<Notification[]>('/notifications/unread/'),
  
  markAsRead: (id: string) => 
    api.post(`/notifications/${id}/mark-as-read/`),
  
  markAllAsRead: () => 
    api.post('/notifications/mark-all-as-read/'),
  
  deleteNotification: (id: string) => 
    api.delete(`/notifications/${id}/`),
  
  deleteAllNotifications: () => 
    api.delete('/notifications/delete-all/'),
  
  getNotificationCount: () => 
    api.get<NotificationCount>('/notifications/count/'),
}; 