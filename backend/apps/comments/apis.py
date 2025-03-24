from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.comments.models import Comment
from apps.comments.selectors import (
    comment_get,
    comment_list,
    comment_list_by_post,
    comment_list_by_user,
)
from apps.comments.services import comment_create, comment_update, comment_delete


class CommentDetailApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        content = serializers.CharField()
        created_at = serializers.DateTimeField()
        created_by = serializers.IntegerField(source="created_by.id")
        post = serializers.IntegerField(source="post.id")
        post_title = serializers.CharField(source="post.title")

    def get(self, request, comment_id):
        comment = comment_get(comment_id)
        if comment is None:
            raise Http404
        data = self.OutputSerializer(comment).data
        return Response(data)


class CommentListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        content = serializers.CharField(required=False)
        created_by = serializers.IntegerField(required=False)
        post__title = serializers.CharField(required=False)

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        content = serializers.CharField()
        created_at = serializers.DateTimeField()
        created_by_id = serializers.IntegerField()
        post_id = serializers.IntegerField()

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)
        comments = comment_list(filters=filters_serializer.validated_data)
        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=comments,
            request=request,
            view=self,
        )


class CommentCreateApi(APIView):
    class InputSerializer(serializers.Serializer):
        content = serializers.CharField()
        post_id = serializers.IntegerField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = comment_create(created_by=request.user, **serializer.validated_data)
        data = CommentDetailApi.OutputSerializer(comment).data
        return Response(data)


class CommentUpdateApi(APIView):
    class InputSerializer(serializers.Serializer):
        content = serializers.CharField(required=True)

    def post(self, request, comment_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = comment_get(comment_id)
        if comment is None:
            raise Http404
        comment = comment_update(comment, **serializer.validated_data)
        data = CommentDetailApi.OutputSerializer(comment).data
        return Response(data)


class CommentDeleteApi(APIView):
    def post(self, request, comment_id):
        comment = comment_get(comment_id)
        if comment is None:
            raise Http404
        comment_delete(comment)
        return Response(status=204)


class PostCommentsListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    def get(self, request, post_id):
        filters = {}
        comments = comment_list_by_post(post_id=post_id, filters=filters)
        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=CommentListApi.OutputSerializer,
            queryset=comments,
            request=request,
            view=self,
        )


class UserCommentsListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    def get(self, request, user_id):
        filters = {}
        comments = comment_list_by_user(user_id=user_id, filters=filters)
        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=CommentListApi.OutputSerializer,
            queryset=comments,
            request=request,
            view=self,
        )