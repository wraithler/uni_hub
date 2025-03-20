from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.mixins import SearchMixin
from api.models import Post
from api.pagination import PostPagination
from api.serializers import PostSerializer


class PostListView(SearchMixin):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostPagination

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    search_fields = ["content", "created_by__username", "community__name"]


class PostDetailView(RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class PostCreateView(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

