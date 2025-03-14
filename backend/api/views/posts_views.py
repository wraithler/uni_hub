from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.mixins import SearchMixin
from api.models import Post, Comment
from api.pagination import CommunityPagination
from api.serializers import PostSerializer, CommentSerializer


class PostListView(SearchMixin):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = CommunityPagination

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    search_fields = ["content", "user__name", "community__name"]


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


class CommentCreateView(CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
