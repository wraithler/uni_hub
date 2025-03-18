from django.http import Http404
from rest_framework import serializers
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.pagination import get_paginated_response
from apps.users.models import BaseUser
from apps.users.selectors import user_get, user_list
from apps.users.services import user_create, user_update


class UserDetailApi(APIView):
    class OutputSerializer(serializers.Serializer):
        username = serializers.CharField()

    def get(self, request, user_id):
        user = user_get(user_id)

        if user is None:
            raise Http404

        data = self.OutputSerializer(user).data

        return Response(data)


class UserListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        username = serializers.CharField(required=False)
        is_admin = serializers.BooleanField(
            required=False, allow_null=True, default=None
        )

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = BaseUser
            fields = ("id", "username", "is_admin")

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
        username = serializers.CharField()
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
