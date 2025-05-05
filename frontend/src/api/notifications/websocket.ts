import { toast } from 'sonner';
import { Notification } from './index';

type WebSocketMessage = {
  type: 'notification';
  data: Notification;
};

class NotificationWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // Start with 1 second
  private maxReconnectTimeout = 30000; // Max 30 seconds
  private onNotificationCallback: ((notification: Notification) => void) | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/notifications/`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.reconnectTimeout = 1000;
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        if (message.type === 'notification') {
          this.handleNotification(message.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleNotification(notification: Notification) {
    if (this.onNotificationCallback) {
      this.onNotificationCallback(notification);
    }

    // Show toast for new notifications
    if (!notification.is_read) {
      toast(notification.message, {
        description: notification.title,
        duration: 5000,
      });
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    this.reconnectTimeout = Math.min(
      this.reconnectTimeout * 2,
      this.maxReconnectTimeout
    );

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, this.reconnectTimeout);
  }

  public onNotification(callback: (notification: Notification) => void) {
    this.onNotificationCallback = callback;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create a singleton instance
export const notificationWebSocket = new NotificationWebSocket(); 