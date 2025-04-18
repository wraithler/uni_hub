from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from apps.notifications.models import UserNotificationPreference
from apps.notifications.selectors import user_notification_preference_get
from apps.notifications.services import notification_preference_update
from apps.api.mixins import ApiAuthMixin

class UserNotificationPreferenceDetailAPI(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserNotificationPreference
            fields = "__all__"
            read_only_fields = ("user",)
            
    def get(self, request):
        preference = user_notification_preference_get(user=request.user)
        if not preference:
            raise Http404("Notification preference not found")
        data = self.OutputSerializer(preference).data
        return Response(data)