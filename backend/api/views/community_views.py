from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.models import Community
from api.pagination import CommunityPagination
from api.serializers import CommunitySerializer


class CommunityListView(ListAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    pagination_class = CommunityPagination

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class CommunityDetailView(RetrieveAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]