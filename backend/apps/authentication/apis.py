from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.mixins import ApiAuthMixin


class UserMeApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        email = serializers.EmailField()
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        is_admin = serializers.BooleanField()
        is_superuser = serializers.BooleanField()
        is_staff = serializers.BooleanField()
        is_email_verified = serializers.BooleanField()

    def get(self, request):
        data = self.OutputSerializer(request.user).data

        return Response(data)
