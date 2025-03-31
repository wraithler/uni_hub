from django.db import transaction
from apps.notificationpref.models import UserNotificationPreference
from apps.users.models import BaseUser
from apps.common.services import model_update

@transaction.atomic
def notification_preference_create(
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
def notification_preference_update(
    *,
    user: BaseUser,
    data: dict
) -> UserNotificationPreference:
    pref = UserNotificationPreference.objects.get(user=user)
    
    updatable_fields = [
        'event_updates',
        'post_notifications',
        'announcements',
        'email_notifications',
        'in_app_notifications'
    ]
    
    pref, has_updated = model_update(
        instance=pref,
        fields=updatable_fields,
        data=data
    )
    
    if 'subscribed_communities' in data:
        pref.subscribed_communities.set(data['subscribed_communities'])
    
    return pref