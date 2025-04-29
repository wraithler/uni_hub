from django.urls import path

from apps.feed.apis import FeedListApi

urlpatterns = [path("", FeedListApi.as_view(), name="feed")]
