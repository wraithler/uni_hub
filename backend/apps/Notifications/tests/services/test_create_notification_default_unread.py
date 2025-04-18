from django.test import TestCase
from apps.notifications.services import notification_create
from apps.notifications.models import Notification
from apps.users.factories import BaseUserFactory


class NotificationCreateTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory()

    def test_create_notification_default_unread(self):
        notification = notification_create(
            recipient=self.user,
            message="Test notification",
            notification_type="alert"
        )

        self.assertIsInstance(notification, Notification)
        self.assertEqual(notification.recipient, self.user)
        self.assertEqual(notification.message, "Test notification")
        self.assertEqual(notification.notification_type, "alert")
        self.assertFalse(notification.is_read)

    def test_create_notification_with_is_read_true(self):
        notification = notification_create(
            recipient=self.user,
            message="Already read",
            notification_type="info",
            is_read=True
        )

        self.assertTrue(notification.is_read)
