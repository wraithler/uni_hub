import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../api/notifications';
import { useNotifications } from '../../api/notifications/useNotifications.ts';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { toast } from 'sonner';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = async () => {
    try {
      // First try to navigate
      if (notification.content_type === 'comment') {
        const postId = notification.post_id || notification.object_id;
        if (postId) {
          navigate(`/posts/${postId}`);
        }
      } else if (notification.content_type === 'post') {
        navigate(`/posts/${notification.object_id}`);
      } else if (notification.content_type === 'community') {
        navigate(`/communities/${notification.object_id}`);
      } else if (notification.content_type === 'event') {
        navigate(`/events/${notification.object_id}`);
      }

      // Then mark as read if not already read
      if (!notification.is_read) {
        await markAsRead.mutateAsync(notification.id);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Failed to process notification');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate(notification.id);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors relative',
        !notification.is_read && [
          'bg-muted/30',
          'animate-in fade-in slide-in-from-right duration-300'
        ]
      )}
      onClick={handleClick}
    >
      {!notification.is_read && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
      )}
      <div className={cn(
        'flex-1 space-y-1',
        !notification.is_read && 'pl-4'
      )}>
        <p className={cn(
          'text-sm leading-none',
          !notification.is_read ? 'font-semibold' : 'font-medium'
        )}>
          {notification.title}
        </p>
        <p className={cn(
          'text-sm',
          !notification.is_read ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleDelete}
        disabled={deleteNotification.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}; 