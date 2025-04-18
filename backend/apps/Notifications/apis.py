from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from apps.notifications.models import Notification
from apps.notifications.selectors import user_notifications_get
from apps.notifications.services import mark_notification_as_read
from apps.api.mixins import ApiAuthMixin

class UserNotificationListAPI(ApiAuthMixin, APIView):
    """
    Retrieves a list of notifications for the authenticated user.
    """
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Notification
            fields = "__all__"
            read_only_fields = ("user",)
            
    def get(self, request):
        notifications = user_notifications_get(user=request.user)
        if not notifications:
            return Response({"message": "No notifications found."}, status=404)
        data = self.OutputSerializer(notifications, many=True).data
        return Response(data)


class UserNotificationDetailAPI(ApiAuthMixin, APIView):
    """
    Retrieves details of a single notification for the authenticated user.
    """
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Notification
            fields = "__all__"
            read_only_fields = ("user",)
            
    def get(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
        except Notification.DoesNotExist:
            raise Http404("Notification not found.")
        data = self.OutputSerializer(notification).data
        return Response(data)
        
    def put(self, request, notification_id):
        """
        Marks the notification as read.
        """
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
        except Notification.DoesNotExist:
            raise Http404("Notification not found.")
            
        # Use the service function instead of direct modification
        mark_notification_as_read(notification=notification)
        
        return Response({"message": "Notification marked as read."})