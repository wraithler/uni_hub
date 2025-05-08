from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.exceptions import ApplicationError
from apps.users.apis import UserDetailApi
from apps.users.services import user_create


class UserMeApi(APIView):
    def get(self, request):
        data = UserDetailApi.OutputSerializer(
            request.user, context={"request": request}
        ).data

        return Response(data)


class UserLoginApi(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            raise ApplicationError(
                "Required parameters were not supplied", extra={"reason": "validation"}
            )

        user = authenticate(email=email, password=password)

        if user is not None:
            login(request, user)
            data = UserDetailApi.OutputSerializer(
                user, context={"request": request}
            ).data
            return Response(data=data, status=status.HTTP_200_OK)

        raise ApplicationError(
            "Supplied credentials are not valid for any account",
            extra={"reason": "invalid"},
        )


class UserLogoutApi(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


@method_decorator(ensure_csrf_cookie, name="dispatch")
class UserCSRFCookieApi(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(data={"detail": "Set CSRF token"}, status=status.HTTP_200_OK)


class UserRegisterApi(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        first_name = request.data.get("first_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        password = request.data.get("password")
        dob = request.data.get("dob")
        address = request.data.get("address")
        post_code = request.data.get("post_code")
        country = request.data.get("country")

        if not email or not password or not first_name or not last_name:
            return ApplicationError(
                "Required parameters were not supplied", extra={"reason": "validation"}
            )

        user_create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            dob=dob,
            address=address,
            post_code=post_code,
            country=country,
        )

        return Response(status=status.HTTP_200_OK)
