import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, Notification } from './index';
import { toast } from 'sonner';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications().then(res => res.data),
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const { data: unreadNotifications, isLoading: isLoadingUnread } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationsApi.getUnreadNotifications().then(res => res.data),
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const { data: notificationCount, isLoading: isLoadingCount } = useQuery({
    queryKey: ['notifications', 'count'],
    queryFn: () => notificationsApi.getNotificationCount().then(res => res.data),
    refetchInterval: 10000, // Poll every 10 seconds
  });

  const markAsRead = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
      toast.success('Notification marked as read');
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark all notifications as read');
    },
  });

  const deleteNotification = useMutation({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    },
  });

  const deleteAllNotifications = useMutation({
    mutationFn: notificationsApi.deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'count'] });
      toast.success('All notifications deleted');
    },
    onError: () => {
      toast.error('Failed to delete all notifications');
    },
  });

  return {
    notifications,
    unreadNotifications,
    notificationCount,
    isLoading: isLoadingNotifications || isLoadingUnread || isLoadingCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
}; 