from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework_simplejwt.authentication import JWTAuthentication
from apps.notificationpref.models import UserNotificationPreference
from apps.notificationpref.selectors import get_user_notification_preference

class ApiAuthMixin:
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class UserNotificationPreferenceRetrieveAPI(ApiAuthMixin, APIView):
    
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserNotificationPreference
            fields = "__all__"
            read_only_fields = ("user",)

    def get(self, request):
        pref = get_user_notification_preference(user=request.user)
        serializer = self.OutputSerializer(pref)
        return Response(serializer.data)

class UserNotificationPreferenceUpdateAPI(ApiAuthMixin, APIView):    
    class InputSerializer(serializers.Serializer):
        email_notifications = serializers.BooleanField(required=False)
        sms_notifications = serializers.BooleanField(required=False)
        push_notifications = serializers.BooleanField(required=False)

    def patch(self, request):
        pref = get_user_notification_preference(user=request.user)
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        for attr, value in serializer.validated_data.items():
            setattr(pref, attr, value)
        pref.save()

        output_serializer = UserNotificationPreferenceRetrieveAPI.OutputSerializer(pref)
        return Response(output_serializer.data)