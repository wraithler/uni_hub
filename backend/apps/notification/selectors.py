from .models import Notification


def get_notifications(user, is_read=None, is_important=None, notification_type=None):
    filters = {'user': user}
    if is_read is not None: filters['is_read'] = is_read
    if is_important is not None: filters['is_important'] = is_important
    if notification_type: filters['notification_type'] = notification_type
    return Notification.objects.filter(**filters)


def get_notification_by_id(notification_id):
    return Notification.objects.filter(id=notification_id).first()


def get_unread_count(user):
    return Notification.objects.filter(user=user, is_read=False).count()


def get_paginated_notifications(queryset, page_size=10, page_number=1):
    start, end = (page_number - 1) * page_size, page_number * page_size
    return queryset[start:end]
