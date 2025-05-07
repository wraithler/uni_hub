from django.contrib.auth.tokens import default_token_generator
from django.http import Http404, HttpResponseForbidden
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.mixins import AuthAPIView
from apps.api.pagination import get_paginated_response
from apps.communities.apis import CommunityListApi
from apps.communities.selectors import community_list
from apps.emails.services import verification_email_create
from apps.users.models import BaseUser
from apps.users.selectors import user_get, user_list
from apps.users.services import user_create, user_update


class UserDetailApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        email = serializers.EmailField()
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        bio = serializers.CharField(required=False)
        academic_department = serializers.CharField(required=False)
        year_of_study = serializers.IntegerField(required=False)
        role = serializers.CharField(required=False)
        gender = serializers.CharField(required=False)
        website_url = serializers.URLField(required=False)
        github_url = serializers.URLField(required=False)
        linkedin_url = serializers.URLField(required=False)
        posts = serializers.SerializerMethodField()
        communities = serializers.SerializerMethodField()
        friends = serializers.SerializerMethodField()
        created_at = serializers.DateTimeField()
        interests = serializers.SerializerMethodField()
        contact_email = serializers.EmailField(required=False)
        contact_phone = serializers.CharField(required=False)
        is_email_verified = serializers.BooleanField(required=False)
        is_superuser = serializers.BooleanField(required=False)

        def get_posts(self, obj):
            return obj.posts.all().count()

        def get_communities(self, obj):
            return obj.memberships.all().count()

        def get_friends(self, obj):
            return obj.friends.all().count()

        def get_interests(self, obj):
            return [interest.name for interest in obj.interests.all()]

    def get(self, request, user_id):
        if user_id is None:
            user_id = request.user.id

        user = user_get(user_id)

        if user is None:
            raise Http404

        data = self.OutputSerializer(user).data

        return Response(data)


class UserListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        community_id = serializers.IntegerField(required=False)
        name = serializers.CharField(required=False)
        is_staff = serializers.BooleanField(required=False)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = BaseUser
            fields = ("id", "email", "first_name", "last_name", "bio")

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        users = user_list(filters=filters_serializer.validated_data)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=users,
            request=request,
            view=self,
        )


class UserCreateApi(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        password = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = user_create(**serializer.validated_data)

        data = UserDetailApi.OutputSerializer(user).data  # Re-use serializer

        return Response(data)


class UserUpdateApi(APIView):
    class InputSerializer(serializers.Serializer):
        first_name = serializers.CharField(required=True)
        last_name = serializers.CharField(required=True)
        # TODO: Add others

    def post(self, request, user_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = user_get(user_id)

        if user is None:
            raise Http404

        user = user_update(user=user, data=serializer.validated_data)

        data = UserDetailApi.OutputSerializer(user).data

        return Response(data)


class UserCommunitiesListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    def get(self, request):
        user_id = request.user.id
        filters = {"user_id": user_id}
        communities = community_list(filters=filters)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=CommunityListApi.OutputSerializer,
            queryset=communities,
            request=request,
            view=self,
        )


class UserCreateEmailVerificationApi(AuthAPIView):
    def get(self, request):
        user = request.user

        if not user or user.is_email_verified:
            return HttpResponseForbidden()

        verification_email_create(user)

        return Response(status=status.HTTP_200_OK)


class UserVerifyEmailApi(AuthAPIView):
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")

        if not uid or not token:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        uid = urlsafe_base64_decode(uid)
        user = user_get(uid)

        if not user or user != request.user:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(user, token):
            user_update(user=user, data={"is_email_verified": True})
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)
