from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.api.mixins import AuthAPIView
from .models import Notification
from .selectors import notification_list_by_user, notification_list_unread_by_user, notification_count
from .services import notification_mark_as_read, notification_mark_all_as_read, notification_delete, notification_delete_all
from apps.api.pagination import LimitOffsetPagination


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class NotificationListAPI(AuthAPIView):
    def get(self, request):
        user = request.user
        notifications = notification_list_by_user(user=user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class NotificationUnreadListAPI(AuthAPIView):
    def get(self, request):
        user = request.user
        notifications = notification_list_unread_by_user(user=user)
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


class NotificationMarkAsReadAPI(AuthAPIView):
    def post(self, request, pk):
        success = notification_mark_as_read(notification_id=pk)
        if success:
            return Response({"detail": "Notification marked as read"}, status=status.HTTP_200_OK)
        return Response({"detail": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)


class NotificationMarkAllAsReadAPI(AuthAPIView):
    def post(self, request):
        user = request.user
        success = notification_mark_all_as_read(user=user)
        if success:
            return Response({"detail": "All notifications marked as read"}, status=status.HTTP_200_OK)
        return Response({"detail": "No unread notifications"}, status=status.HTTP_200_OK)


class NotificationDeleteAPI(AuthAPIView):
    def delete(self, request, pk):
        success = notification_delete(notification_id=pk)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)


class NotificationDeleteAllAPI(AuthAPIView):
    def delete(self, request):
        user = request.user
        success = notification_delete_all(user=user)
        if success:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "No notifications to delete"}, status=status.HTTP_200_OK)


class NotificationCountAPI(AuthAPIView):
    def get(self, request):
        user = request.user
        count = notification_count(user=user)
        return Response({"count": count}, status=status.HTTP_200_OK)