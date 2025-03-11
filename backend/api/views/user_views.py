from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.models import User
from api.serializers import UserSerializer


class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user