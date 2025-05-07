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
