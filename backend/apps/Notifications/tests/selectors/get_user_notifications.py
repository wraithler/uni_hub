from django.test import TestCase
from apps.notifications.models import Notification
from apps.notifications.selectors import (
    get_user_notifications,
    get_unread_notifications,
)
from apps.users.factories import BaseUserFactory
from django.utils import timezone


class NotificationSelectorTests(TestCase):
    def setUp(self):
        self.user1 = BaseUserFactory()
        self.user2 = BaseUserFactory()

        Notification.objects.create(
            recipient=self.user1,
            message="Message 1",
            notification_type="comment",
            is_read=False,
            created_at=timezone.now()
        )

        Notification.objects.create(
            recipient=self.user1,
            message="Message 2",
            notification_type="like",
            is_read=True,
            created_at=timezone.now()
        )

        Notification.objects.create(
            recipient=self.user2,
            message="Message 3",
            notification_type="follow",
            is_read=False,
            created_at=timezone.now()
        )

    def test_get_user_notifications(self):
        user1_notifications = get_user_notifications(self.user1)
        self.assertEqual(user1_notifications.count(), 2)
        self.assertTrue(all(n.recipient == self.user1 for n in user1_notifications))

    def test_get_unread_notifications(self):
        unread = get_unread_notifications(self.user1)
        self.assertEqual(unread.count(), 1)
        self.assertFalse(unread.first().is_read)
        self.assertEqual(unread.first().recipient, self.user1)
