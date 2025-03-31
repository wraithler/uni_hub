from itertools import chain
from django.db.models import QuerySet
from django.utils import timezone

from apps.events.selectors import event_list
from apps.posts.selectors import post_list
from apps.users.models import BaseUser

def time_since_created(created_at):
    now = timezone.now()
    diff = now - created_at
    hours = diff.total_seconds() // 3600
    if hours < 1:
        return f"{int(hours * 60)}m"
    if hours < 24:
        return f"{int(hours)}h"
    return f"{int(hours // 24)}d"

def feed_list(*, user: BaseUser, filters: dict = None) -> QuerySet:
    filters = filters or {}
    posts_filters = {"community__memberships__user": user, **filters}
    events_filters = {"community__memberships__user": user, **filters}

    posts = post_list(filters=posts_filters).values(
        "id", "title", "content", "created_by__first_name", "created_by__last_name",
        "community__name", "created_at", "likes", "comments", "community__id", "created_at"
    )
    events = event_list(filters=events_filters).values(
        "id", "title", "description", "created_by__first_name", "created_by__last_name",
        "community__name", "created_at", "attendees", "location", "community__id", "created_at"
    )

    # Normalize & unify structure
    posts_normalised = [
        {
            "id": post["id"],
            "type": "post",
            "title": post["title"],
            "content": post["content"],
            "created_by": f"{post['created_by__first_name']} {post['created_by__last_name']}",
            "community": {
                "id": post["community__id"],
                "name": post["community__name"],
            },
            "timestamp": time_since_created(post["created_at"]),
            "likes": post["likes"],
            "comments": post["comments"],
            "created_at": post["created_at"],
        }
        for post in posts
    ]

    events_normalised = [
        {
            "id": event["id"],
            "type": "event",
            "title": event["title"],
            "description": event["description"],
            "created_by": f"{event['created_by__first_name']} {event['created_by__last_name']}",
            "community": {
                "id": event["community__id"],
                "name": event["community__name"],
            },
            "timestamp": time_since_created(event["created_at"]),
            "attendees": event["attendees"],
            "location": event["location"],
            "created_at": event["created_at"],
        }
        for event in events
    ]

    combined_feed = sorted(
        chain(posts_normalised, events_normalised),
        key=lambda x: x["created_at"],
        reverse=True
    )

    return combined_feed
