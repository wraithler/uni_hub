from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.exceptions import ApplicationError
from apps.users.services import user_create


@method_decorator(login_required, name='dispatch')
class UserMeApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        email = serializers.EmailField()
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        is_superuser = serializers.BooleanField()
        is_email_verified = serializers.BooleanField()
        friend_count = serializers.SerializerMethodField()
        community_count = serializers.SerializerMethodField()
        post_count = serializers.SerializerMethodField()

        def get_friend_count(self, user):
            return len(user.friends.all())

        def get_community_count(self, user):
            return len(user.memberships.all())

        def get_post_count(self, user):
            return len(user.posts.all())

    def get(self, request):
        data = self.OutputSerializer(request.user).data

        return Response(data)


class UserLoginApi(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return ApplicationError("Required parameters were not supplied", extra={"reason": "validation"})

        user = authenticate(email=email, password=password)

        if user is not None:
            login(request, user)
            data = UserMeApi.OutputSerializer(user).data
            return Response(data=data, status=status.HTTP_200_OK)

        return ApplicationError("Supplied credentials are not valid for any account", extra={"reason": "invalid"})


class UserLogoutApi(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserCSRFCookieApi(APIView):
    def get(self, request):
        return Response(status=status.HTTP_200_OK)


class UserRegisterApi(APIView):
    def post(self, request):
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password or not first_name or not last_name:
            return ApplicationError("Required parameters were not supplied", extra={"reason": "validation"})

        user_create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )

        return Response(status=status.HTTP_200_OK)
