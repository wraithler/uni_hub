from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from apps.notification_preferences.models import UserNotificationPreference
from apps.notification_preferences.selectors import user_notification_preference_get
from apps.notification_preferences.services import notification_preference_update
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
            return Http404

        data = self.OutputSerializer(preference).data

        return Response(data)


class UserNotificationPreferenceUpdateAPI(ApiAuthMixin, APIView):
    class InputSerializer(serializers.Serializer):
        email_notifications = serializers.BooleanField(required=False)
        sms_notifications = serializers.BooleanField(required=False)
        push_notifications = serializers.BooleanField(required=False)

    def patch(self, request):
        preference = user_notification_preference_get(user=request.user)

        if not preference:
            return Http404

        preference = notification_preference_update(notification_preference=preference, data=request.data)

        data = UserNotificationPreferenceDetailAPI.OutputSerializer(preference).data

        return Response(data)
