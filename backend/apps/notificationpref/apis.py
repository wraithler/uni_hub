from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication
from apps.notificationpref.models import UserNotificationPreference
from apps.notificationpref.selectors import user_notification_preference_get
from apps.notificationpref.services import notification_preference_update 
from apps.api.mixins import ApiAuthMixin

class UserNotificationPreferenceRetrieveAPI(ApiAuthMixin, APIView):
    
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserNotificationPreference
            fields = "__all__"
            read_only_fields = ("user",)

    def get(self, request):
        pref = user_notification_preference_get(user=request.user)
        serializer = self.OutputSerializer(pref)
        return Response(serializer.data)

class UserNotificationPreferenceUpdateAPI(ApiAuthMixin, APIView):    
    class InputSerializer(serializers.Serializer):
        email_notifications = serializers.BooleanField(required=False)
        sms_notifications = serializers.BooleanField(required=False)
        push_notifications = serializers.BooleanField(required=False)

    def patch(self, request):
        pref = user_notification_preference_get(user=request.user)
        data = request.data
        pref = notification_preference_update(user=request.user, data=data)
        serializer = self.OutputSerializer(pref)
        return Response(serializer.data)