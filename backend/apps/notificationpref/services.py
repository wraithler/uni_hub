from django.db import transaction
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser

@transaction.atomic
def create_notification_preference(
    *,
    user: BaseUser,
    event_updates: bool = True,
    post_notifications: bool = True,
    announcements: bool = True,
    email_notifications: bool = True,
    in_app_notifications: bool = True,
    subscribed_communities: list = None
) -> UserNotificationPreference:

    if subscribed_communities is None:
        subscribed_communities = []
    
    pref = UserNotificationPreference.objects.create(
        user=user,
        event_updates=event_updates,
        post_notifications=post_notifications,
        announcements=announcements,
        email_notifications=email_notifications,
        in_app_notifications=in_app_notifications
    )
    
    if subscribed_communities:
        pref.subscribed_communities.set(subscribed_communities)
    
    return pref

@transaction.atomic
def update_notification_preference(
    *,
    user: BaseUser,
    data: dict
) -> UserNotificationPreference:

    pref = UserNotificationPreference.objects.get(user=user)

    for field in [
        'event_updates',
        'post_notifications',
        'announcements',
        'email_notifications',
        'in_app_notifications'
    ]:
        if field in data:
            setattr(pref, field, data[field])

    if 'subscribed_communities' in data:
        pref.subscribed_communities.set(data['subscribed_communities'])
    
    pref.save()
    return pref