from django.core.signing import SignatureExpired
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from api.email_utils import send_email_verification, signer
from api.models import User
from api.serializers import RegisterSerializer, LoginSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            send_email_verification(user)

            return Response(
                {"message": "User registered successfully!"},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        if not user.is_active:
            return Response(
                {"message": "Your account is no longer active, please contact support"}, status=status.HTTP_403_FORBIDDEN
            )

        if not user.is_email_verified:
            return Response(
                {"message": "Please verify your email address before logging in"}, status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token", None)
        try:
            user_id = signer.unsign(token, max_age=60 * 60 * 2)
        except SignatureExpired:
            return Response(
                {"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.get(id=user_id)
        user.is_email_verified = True
        user.save()

        return Response(
            {"message": "Email verified successfully!"},
            status=status.HTTP_200_OK,
        )
