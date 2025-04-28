from rest_framework import serializers
from rest_framework.response import Response

from apps.api.mixins import AuthAPIView


class UserMeApi(AuthAPIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        email = serializers.EmailField()
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        is_admin = serializers.BooleanField()
        is_superuser = serializers.BooleanField()
        is_staff = serializers.BooleanField()
        is_email_verified = serializers.BooleanField()
        friend_count = serializers.SerializerMethodField()
        community_count = serializers.SerializerMethodField()
        post_count = serializers.SerializerMethodField()

        def get_friend_count(self, user):
            return len(user.friends.all())

        def get_community_count(self, user):
            return len(user.memberships.all())

        def get_post_count(self, user):
            return len(user.posts.all())

    def get(self, request):
        data = self.OutputSerializer(request.user).data

        return Response(data)