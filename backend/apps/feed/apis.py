from rest_framework import serializers

from apps.api.mixins import ApiAuthMixin
from apps.api.pagination import get_paginated_response, LimitOffsetPagination
from apps.feed.selectors import feed_list
from apps.users.apis import UserDetailApi


class CommunitySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class FeedListApi(ApiAuthMixin):
    class Pagination(LimitOffsetPagination):
        default_limit = 10

    class FeedItemSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        type = serializers.ChoiceField(choices=["post", "event"])
        created_by = UserDetailApi.OutputSerializer()
        community = CommunitySerializer()
        timestamp = serializers.DateTimeField()

        # Optional fields (appear conditionally)
        content = serializers.CharField(required=False, allow_null=True)
        likes = serializers.IntegerField(required=False, allow_null=True)
        comments = serializers.IntegerField(required=False, allow_null=True)

        title = serializers.CharField(required=False, allow_null=True)
        description = serializers.CharField(required=False, allow_null=True)
        attendees = serializers.IntegerField(required=False, allow_null=True)
        location = serializers.CharField(required=False, allow_null=True)

        def to_representation(self, instance):
            """
            Custom logic to exclude unnecessary fields dynamically.
            """
            data = super().to_representation(instance)

            if data["type"] == "post":
                del data["title"]
                del data["description"]
                del data["attendees"]
                del data["location"]
            elif data["type"] == "event":
                del data["content"]
                del data["likes"]
                del data["comments"]

            return data

    def get(self, request):
        feed = feed_list(user=request.user)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.FeedItemSerializer,
            queryset=feed,
            request=request,
            view=self
        )
