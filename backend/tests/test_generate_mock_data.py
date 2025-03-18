import json
import random

from django.test import TestCase
from rest_framework import serializers

from api.factories import PostFactory, PostLikeFactory, PostCommentFactory, EventFactory
from api.models import Post, Event, PostLike, Comment


class MockDataTestCase(TestCase):
    def test_get_home_page_mock_data(self):
        posts = PostFactory.create_batch(10)
        for post in posts:
            lc = random.randint(0, 1000)
            cc = random.randint(0, 1000)
            PostLikeFactory.create_batch(lc, post=post)
            PostCommentFactory.create_batch(cc, post=post)

        events = EventFactory.create_batch(5, community=posts[0].community)

        class PostSerializer(serializers.ModelSerializer):
            likes_count = serializers.SerializerMethodField()
            comments_count = serializers.SerializerMethodField()
            community_name = serializers.CharField(source='community.name')
            created_by_name = serializers.CharField(source='created_by.name')
            created_by_profile_picture = serializers.CharField(source='created_by.profile_picture')

            class Meta:
                model = Post
                fields = 'title', 'content', 'created_by_name', 'community_name', 'created_by_profile_picture', 'likes_count', 'comments_count'

            def get_likes_count(self, obj):
                return obj.likes.count()

            def get_comments_count(self, obj):
                return obj.comments.count()

        class EventSerializer(serializers.ModelSerializer):
            class Meta:
                model = Event
                fields = '__all__'

        post_data = PostSerializer(posts, many=True).data
        event_data = EventSerializer(events, many=True).data

        mock_data = {
            "posts": post_data,
            "events": event_data,
        }

        with open("mock_data.json", "w") as f:
            f.write(json.dumps(mock_data, indent=4))