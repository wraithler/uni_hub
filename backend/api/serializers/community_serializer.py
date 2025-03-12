from rest_framework import serializers

from api.models import Community, CommunityCategory


class CommunityCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityCategory
        fields = "__all__"


class CommunitySerializer(serializers.ModelSerializer):
    category = CommunityCategorySerializer()

    class Meta:
        model = Community
        fields = "__all__"
