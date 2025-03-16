from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from api.models import Post, Event


class FeedView(ListAPIView):
    def __get_posts(self, user, n=10):
        """Get n recent posts for the user from communities the user is a part of"""
        return Post.objects.filter(community__in=user.communities.all()).order_by(
            "-created_at"
        )[:n]

    def __get_friend_posts(self, user, n=10):
        """Get n recent posts from friends"""
        return Post.objects.filter(author__in=user.friends.all()).order_by(
            "-created_at"
        )[:n]

    def __get_upcoming_events(self, user, n=10):
        """Get n upcoming events for the user"""
        return Event.objects.filter(attendees=user).order_by("start_time")[:n]

    def get_queryset(self):
        user = self.request.user
        posts = self.__get_posts(user)
        friend_posts = self.__get_friend_posts(user)
        events = self.__get_upcoming_events(user)
        feed = list(posts) + list(friend_posts)
        feed.sort(key=lambda post: post.get_score(user), reverse=True)

        return Response({"feed": feed, "events": events})
