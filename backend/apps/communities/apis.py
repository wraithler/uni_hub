from functools import partial

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.mixins import AuthAPIView
from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.communities.models import Community
from apps.communities.selectors import (
    community_get,
    community_list,
    community_dashboard_get,
)
from apps.communities.services import community_create, community_update, community_join, community_leave, \
    community_join_request_create
from apps.events.apis import EventListApi
from apps.events.selectors import event_list


class CommunityDetailApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        description = serializers.CharField()
        tags = serializers.SerializerMethodField()
        category = serializers.SerializerMethodField()
        member_count = serializers.SerializerMethodField()
        post_count = serializers.SerializerMethodField()
        is_member = serializers.SerializerMethodField()
        has_requested_to_join = serializers.SerializerMethodField()
        privacy = serializers.CharField()
        is_moderator = serializers.SerializerMethodField()
        is_admin = serializers.SerializerMethodField()
        guidelines = serializers.SerializerMethodField()
        about = serializers.CharField()
        contact_email = serializers.EmailField()

        def get_member_count(self, obj):
            return obj.memberships.count()

        def get_post_count(self, obj):
            return obj.posts.count()

        def get_tags(self, obj):
            return obj.tags.all().values_list("name", flat=True)

        def get_category(self, obj):
            return obj.category.name

        def get_is_member(self, obj):
            return obj.is_member(self.context.get("request").user)

        def get_has_requested_to_join(self, obj):
            return obj.has_requested_to_join(self.context.get("request").user)

        def get_is_moderator(self, obj):
            return obj.is_moderator(self.context.get("request").user)

        def get_is_admin(self, obj):
            return obj.is_admin(self.context.get("request").user)

        def get_guidelines(self, obj):
            return [guideline.content for guideline in obj.guidelines.all()]

    def get(self, request, community_id):
        community = community_get(community_id)

        if community is None:
            raise Http404

        data = self.OutputSerializer(community, context={"request": request}).data

        return Response(data)


class CommunityListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 10

    class FilterSerializer(serializers.Serializer):
        is_featured = serializers.BooleanField(required=False, allow_null=True)
        category = serializers.CharField(required=False, allow_null=True)
        my = serializers.BooleanField(required=False, allow_null=True)
        name = serializers.CharField(required=False, allow_null=True)
        sort_by = serializers.CharField(required=False, allow_null=True)
        user_id = serializers.IntegerField(required=False, allow_null=True)

    class OutputSerializer(serializers.ModelSerializer):
        member_count = serializers.SerializerMethodField()
        post_count = serializers.SerializerMethodField()
        tags = serializers.SerializerMethodField()
        category = serializers.SerializerMethodField()

        class Meta:
            model = Community
            fields = (
                "id",
                "name",
                "description",
                "member_count",
                "post_count",
                "tags",
                "category",
            )

        def get_member_count(self, obj):
            return obj.memberships.count()

        def get_post_count(self, obj):
            return obj.posts.count()

        def get_tags(self, obj):
            return obj.tags.all().values_list("name", flat=True)

        def get_category(self, obj):
            return obj.category.name

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        if filters_serializer.validated_data.get("category_name", "") == "all":
            filters_serializer.validated_data.pop("category_name")

        communities = community_list(
            filters=filters_serializer.validated_data, request=request
        )

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=partial(
                self.OutputSerializer, context={"request": request}
            ),
            queryset=communities,
            request=request,
            view=self,
        )


class CommunityCreateApi(AuthAPIView):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField()
        description = serializers.CharField()
        tags = serializers.ListField(child=serializers.CharField(), required=False)
        category = serializers.CharField()
        privacy = serializers.CharField()
        about = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.validated_data["created_by"] = request.user
        community = community_create(**serializer.validated_data)

        data = CommunityDetailApi.OutputSerializer(community).data

        return Response(data)


class CommunityUpdateApi(APIView):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField(required=False)
        description = serializers.CharField(required=False)

    def post(self, request, community_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        community = community_get(community_id)

        if community is None:
            raise Http404

        community = community_update(community, **serializer.validated_data)

        data = CommunityDetailApi.OutputSerializer(community).data

        return Response(data)


class CommunityEventsListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    def get(self, request, community_id):
        filters = {"community_id": community_id}
        events = event_list(filters=filters)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=EventListApi.OutputSerializer,
            queryset=events,
            request=request,
            view=self,
        )


class CommunityJoinApi(APIView):
    def post(self, request, community_id):
        community = community_get(community_id)

        if community is None:
            raise Http404

        user = request.user

        community_join(community=community, user=user)

        data = CommunityDetailApi.OutputSerializer(community, context={"request": request}).data
        return Response(data=data, status=status.HTTP_200_OK)


class CommunityLeaveApi(APIView):
    def post(self, request, community_id):
        community = community_get(community_id)

        if community is None:
            raise Http404

        user = request.user

        community_leave(community=community, user=user)

        data = CommunityDetailApi.OutputSerializer(community, context={"request": request}).data
        return Response(data=data, status=status.HTTP_200_OK)


class CommunityRequestJoinApi(APIView):
    def post(self, request, community_id):
        community = community_get(community_id)

        if community is None:
            raise Http404

        community_join_request_create(community=community, user=request.user)

        return Response(status=status.HTTP_200_OK)


class CommunityDashboardDetailApi(AuthAPIView):
    class OutputSerializer(serializers.Serializer):
        total_members = serializers.IntegerField()
        pending_requests = serializers.IntegerField()
        total_posts = serializers.IntegerField()
        total_events = serializers.IntegerField()
        member_growth = serializers.JSONField()
        engagement = serializers.JSONField()

    def get(self, request, community_id):
        community = community_get(community_id)

        if community is None:
            raise Http404

        if not community.is_moderator(request.user):
            raise PermissionDenied

        dashboard_data = community_dashboard_get(community_id=community_id)
        data = self.OutputSerializer(dashboard_data).data

        return Response(data)
