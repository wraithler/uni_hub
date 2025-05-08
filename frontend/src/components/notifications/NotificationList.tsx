import { useNotifications } from '../../api/notifications/useNotifications.ts';
import { NotificationItem } from './NotificationItem.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { type Notification } from '../../api/notifications';
import { type VariantProps } from 'class-variance-authority';

export const NotificationList = () => {
  const {
    notifications,
    isLoading,
    markAllAsRead,
    deleteAllNotifications,
  } = useNotifications();

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h4 className="font-medium">Notifications</h4>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
          >
            Mark all as read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteAllNotifications.mutate()}
            disabled={deleteAllNotifications.isPending}
          >
            Clear all
          </Button>
        </div>
      </div>
      <Separator />
      <ScrollArea className="h-[400px]">
        <div className="flex flex-col">
          {notifications.map((notification: Notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}; 