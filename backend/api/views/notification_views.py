from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.models import Notification, Event, UserProfile
from api.serializers import NotificationSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restrict the returned notifications to those matching user preferences.
        """
        user = self.request.user
        # Assuming UserProfile has a 'interests' field which is a ManyToMany field to Event
        user_profile = user.profile  # Assuming the user has a related profile
        event_ids = user_profile.interests.values_list('id', flat=True)  # Get ids of events matching user interests
        return Notification.objects.filter(event__id__in=event_ids, user=user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Custom logic when creating a notification. For example, check if the event matches the user’s preferences.
        """
        # Here, you could add logic to check if the event is of interest to the user.
        # For simplicity, let's assume notifications are always related to events of interest.
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        """
        Mark the notification as read.
        """
        instance = self.get_object()
        instance.read = True
        instance.save()
        return Response({"status": "Notification marked as read."}, status=status.HTTP_200_OK)

