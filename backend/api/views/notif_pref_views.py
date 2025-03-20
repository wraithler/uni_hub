from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import UserNotificationPreference
from api.serializers import UserNotificationPreferenceSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication


class UserNotificationPreferenceView(APIView):
    serializer_class = UserNotificationPreferenceSerializer
    permission_classes = [IsAuthenticated] 
    authentication_classes = [JWTAuthentication] 

    def get_object(self):        
        user_id = self.kwargs.get('user_id') 
        return UserNotificationPreference.objects.get(user_id=user_id)

    def get(self, request, *args, **kwargs):
        preference = self.get_object()
        serializer = self.serializer_class(preference)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        preference = self.get_object()
        if preference.user != request.user:
            return Response({"detail": "You do not have permission to edit this preference."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(preference, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)