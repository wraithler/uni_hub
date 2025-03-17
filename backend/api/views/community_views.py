from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.mixins import SearchMixin
from api.models import Community, CommunityCategory
from api.pagination import CommunityPagination
from api.serializers import CommunitySerializer, CommunityCategorySerializer
from api.utils import mock_data_utils


class CommunityListView(SearchMixin):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    pagination_class = CommunityPagination

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    search_fields = ["name", "description", "category__name"]


class CommunityDetailView(RetrieveAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class CommunityCreateView(CreateAPIView):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class CommunityCategoryListView(SearchMixin):
    queryset = CommunityCategory.objects.all()
    serializer_class = CommunityCategorySerializer
    pagination_class = CommunityPagination

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    search_fields = ["name", "description"]


class CommunityCategoryDetailView(RetrieveAPIView):
    queryset = CommunityCategory.objects.all()
    serializer_class = CommunityCategorySerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class CommunityCategoryCreateView(CreateAPIView):
    queryset = CommunityCategory.objects.all()
    serializer_class = CommunityCategorySerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
