
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from apps.users.models import BaseUser
from apps.profile_info.services import update_user_profile
from apps.profile_info.selectors import get_user_profile

class ProfileInfoView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    class ProfileInfoSerializer(serializers.ModelSerializer):
        class Meta:
            model = BaseUser
            fields = ["id", "username", "email", "first_name", "last_name"]

    def validate_username(self, value):
        value = value.strip()
        if " " in value:
            raise serializers.ValidationError("Username cannot contain spaces.")
        
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        
        if BaseUser.objects.filter(username=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("This username is already taken.")
        
        return value

    def validate_email(self, value):
        value = value.strip()
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")

        if BaseUser.objects.filter(email=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("This email is already registered.")

        return value

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")

        if user_id and int(user_id) != request.user.id:
            return Response(
                {"detail": "You do not have permission to view this profile."},
                status=status.HTTP_403_FORBIDDEN
            )

        user = get_user_profile(user_id or request.user.id)
        serializer = self.ProfileInfoSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")
        
        if user_id is None:
            user = request.user
        else:
            if request.user.id != int(user_id):
                return Response(
                    {"detail": "Permission denied"},
                    status=status.HTTP_403_FORBIDDEN
                )
            user = get_user_profile(user_id)

        serializer = self.ProfileInfoSerializer(user, data=request.data, partial=True)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            update_user_profile(user, serializer.validated_data)
            return Response(serializer.data)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            