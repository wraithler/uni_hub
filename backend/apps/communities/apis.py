from django.http import Http404
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api.pagination import LimitOffsetPagination, get_paginated_response
from apps.communities.models import Community
from apps.communities.selectors import community_get, community_list
from apps.communities.services import community_create, community_update, community_join
from apps.events.apis import EventListApi
from apps.events.selectors import event_list


class CommunityDetailApi(APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        description = serializers.CharField()
        emoji = serializers.CharField()
        is_private = serializers.BooleanField()

    def get(self, request, community_id):
        community = community_get(community_id)

        if community is None:
            raise Http404

        data = self.OutputSerializer(community).data

        return Response(data)


class CommunityListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        name = serializers.CharField(required=False)
        description = serializers.CharField(required=False)
        visibility = serializers.ChoiceField(
            choices=["public", "private", "all"], required=False
        )
        sort_by = serializers.CharField(required=False)
        membership_status = serializers.ChoiceField(
            choices=["member", "not_member", "all"], required=False
        )

    class OutputSerializer(serializers.ModelSerializer):
        member_count = serializers.SerializerMethodField(method_name="get_member_count")

        class Meta:
            model = Community
            fields = (
                "id",
                "name",
                "description",
                "emoji",
                "is_private",
                "member_count",
            )

        def get_member_count(self, obj):
            return obj.memberships.count()  # todo: refactor this to elsewhere

    def get(self, request):
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        communities = community_list(
            filters=filters_serializer.validated_data, request=request
        )

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=communities,
            request=request,
            view=self,
        )


class CommunityCreateApi(APIView):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField()
        description = serializers.CharField()
        emoji = serializers.CharField()
        # TODO: Add category field

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        community = community_create(**serializer.validated_data)

        data = CommunityDetailApi.OutputSerializer(community).data

        return Response(data)


class CommunityUpdateApi(APIView):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField(required=False)
        description = serializers.CharField(required=False)
        emoji = serializers.CharField(required=False)

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

        return Response()
