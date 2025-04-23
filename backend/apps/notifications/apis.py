from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers

from apps.notifications.models import Notification
from apps.notifications.selectors import (
    notification_list_by_user, 
    notification_list_unread_by_user,
    notification_get
)
from apps.notifications.services import notification_mark_as_read
from apps.api.mixins import ApiAuthMixin

class NotificationListAPI(ApiAuthMixin, APIView):
    """
    Retrieves a list of all notifications for the authenticated user.
    """
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Notification
            fields = "__all__"
            read_only_fields = ("recipient",)
    
    def get(self, request):
        notifications = notification_list_by_user(user=request.user)
        if not notifications:
            return Response({"message": "No notifications found."}, status=404)
        
        data = self.OutputSerializer(notifications, many=True).data
        return Response(data)

class UnreadNotificationListAPI(ApiAuthMixin, APIView):
    """
    Retrieves a list of unread notifications for the authenticated user.
    """
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Notification
            fields = "__all__"
            read_only_fields = ("recipient",)
    
    def get(self, request):
        notifications = notification_list_unread_by_user(user=request.user)
        if not notifications:
            return Response({"message": "No unread notifications found."}, status=404)
        
        data = self.OutputSerializer(notifications, many=True).data
        return Response(data)

class NotificationDetailAPI(ApiAuthMixin, APIView):
    """
    Retrieves details of a single notification for the authenticated user.
    """
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Notification
            fields = "__all__"
            read_only_fields = ("recipient",)
    
    def get(self, request, pk):
        notification = notification_get(user=request.user, notification_id=pk)
        if not notification:
            raise Http404("Notification not found.")
        
        data = self.OutputSerializer(notification).data
        return Response(data)

class MarkNotificationAsReadAPI(ApiAuthMixin, APIView):
    """
    Marks a notification as read.
    """
    def put(self, request, pk):
        notification = notification_get(user=request.user, notification_id=pk)
        if not notification:
            raise Http404("Notification not found.")
        
        # Use the service function to mark as read
        notification_mark_as_read(notification=notification)
        
        return Response({"message": "Notification marked as read."})