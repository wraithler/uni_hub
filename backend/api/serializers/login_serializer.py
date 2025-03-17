from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed("Invalid username or password")
        if not user.is_active:
            raise AuthenticationFailed("User is disabled")

        data["user"] = user
        return data
