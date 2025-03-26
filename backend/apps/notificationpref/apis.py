from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.notificationpref.models import UserNotificationPreference


class UserNotificationPreferenceView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = UserNotificationPreference
            fields = "__all__"

    class InputSerializer(serializers.Serializer):
        email_notifications = serializers.BooleanField(required=False)
        sms_notifications = serializers.BooleanField(required=False)
        push_notifications = serializers.BooleanField(required=False)

    def get_object(self):
        obj, created = UserNotificationPreference.objects.get_or_create(user=self.request.user)
        return obj

    def get(self, request):
        preference = self.get_object()
        serializer = self.OutputSerializer(preference)
        return Response(serializer.data)

    def patch(self, request):
        preference = self.get_object()
        serializer = self.InputSerializer(data=request.data)

        if serializer.is_valid():
            for key, value in serializer.validated_data.items():
                setattr(preference, key, value)
            preference.save()

            return Response(self.OutputSerializer(preference).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
