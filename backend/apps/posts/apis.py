from functools import partial

from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.mixins import AuthAPIView
from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.communities.apis import CommunityDetailApi
from apps.posts.models import PostImages
from apps.posts.selectors import (
    post_get,
    post_list,
)
from apps.posts.services import post_create, post_update, post_delete


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()


class CommunitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField()
    created_at = serializers.DateTimeField()
    created_by = UserSerializer()


class PostDetailApi(AuthAPIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        content = serializers.CharField()
        created_at = serializers.DateTimeField()
        created_by = UserSerializer()
        community = CommunityDetailApi.OutputSerializer()

    def get(self, request, post_id):
        post = post_get(post_id)
        if post is None:
            raise Http404
        data = self.OutputSerializer(post).data
        return Response(data)


class PostListApi(AuthAPIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False, allow_null=True)
        content = serializers.CharField(required=False, allow_null=True)
        created_by = serializers.IntegerField(required=False, allow_null=True)
        community__name = serializers.CharField(required=False, allow_null=True)
        pinned = serializers.BooleanField(required=False, allow_null=True)
        community__id = serializers.IntegerField(required=False, allow_null=True)
        my = serializers.BooleanField(required=False, allow_null=True)
        include_community = serializers.BooleanField(required=False, default=False)

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        content = serializers.CharField()
        created_at = serializers.DateTimeField()
        created_by = UserSerializer()
        community_id = serializers.IntegerField()
        like_count = serializers.SerializerMethodField()
        comment_count = serializers.SerializerMethodField()
        has_liked = serializers.SerializerMethodField()
        image_urls = serializers.SerializerMethodField()
        community = CommunitySerializer()

        def get_like_count(self, obj):
            return obj.likes.count()

        def get_comment_count(self, obj):
            return obj.comments.count()

        def get_has_liked(self, obj):
            return obj.likes.filter(user=self.context.get("request").user).exists()

        def get_image_urls(self, obj):
            return [
                f"https://uwe-uni-hub-bucket.s3.amazonaws.com{image.image.url}"
                for image in obj.images.all()
            ]

        def to_representation(self, instance):
            user = self.context.get("request").user
            if instance.privacy == "members" or instance.community.privacy == "members":
                if not instance.community.memberships.filter(user=user).exists():
                    raise Http404
            return super().to_representation(instance)

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)
        posts = post_list(filters=filters_serializer.validated_data, request=request)
        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=partial(
                self.OutputSerializer, context={"request": request}
            ),
            queryset=posts,
            request=request,
            view=self,
        )


class PostCreateApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        content = serializers.CharField()
        community_id = serializers.IntegerField()
        media = serializers.ListField(child=serializers.IntegerField(), required=False)

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        media = None
        if serializer.validated_data.get("media"):
            media = serializer.validated_data.pop("media")

        post = post_create(created_by=request.user, **serializer.validated_data)

        if media:
            PostImages.objects.bulk_create(
                [
                    PostImages(
                        post=post,
                        image_id=image_id,
                    )
                    for image_id in media
                ]
            )

        data = PostDetailApi.OutputSerializer(post, context={"request": request}).data
        return Response(data)


class PostUpdateApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        content = serializers.CharField(required=False)

    def post(self, request, post_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = post_get(post_id)
        if post is None:
            raise Http404
        post = post_update(post, **serializer.validated_data)
        data = PostDetailApi.OutputSerializer(post).data
        return Response(data)


class PostDeleteApi(AuthAPIView):
    def post(self, request, post_id):
        post = post_get(post_id)
        if post is None:
            raise Http404
        post_delete(post=post, user=request.user)
        return Response(status=204)
