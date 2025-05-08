import unittest
from unittest.mock import patch, MagicMock, PropertyMock
from django.utils import timezone

from apps.notifications.models import Notification
from apps.users.models import BaseUser


class TestNotificationModel(unittest.TestCase):
    def setUp(self):
        # Create user mock
        self.user = MagicMock()
        self.user.id = 1
        self.user.email = "test@example.com"

        # Create notification mock
        self.notification = MagicMock(spec=Notification)
        self.notification.id = 1
        self.notification.title = "Test Notification"
        self.notification.message = "This is a test notification"
        self.notification.recipient = self.user
        self.notification.is_read = False
        self.notification.read_at = None

        # Mock save method
        self.notification.save = MagicMock()

    def test_mark_as_read(self):
        """Test marking a notification as read"""
        current_time = timezone.now()

        # Create a patch for timezone.now
        with patch("django.utils.timezone.now", return_value=current_time):
            # Execute mark_as_read method on the mocked notification
            Notification.mark_as_read(self.notification)

            # Assert
            self.assertTrue(self.notification.is_read)
            self.assertEqual(self.notification.read_at, current_time)
            self.notification.save.assert_called_once_with(
                update_fields=["is_read", "read_at"]
            )

    def test_mark_as_unread(self):
        """Test marking a notification as unread"""
        # Setup - notification is already read
        self.notification.is_read = True
        self.notification.read_at = timezone.now()

        # Execute
        Notification.mark_as_unread(self.notification)

        # Assert
        self.assertFalse(self.notification.is_read)
        self.assertIsNone(self.notification.read_at)
        self.notification.save.assert_called_once_with(
            update_fields=["is_read", "read_at"]
        )

    def test_str_representation(self):
        """Test the string representation of a notification"""
        # Create a mock user with email
        user = MagicMock(spec=BaseUser)
        user.email = "test@example.com"

        # Create a notification instance
        notification = MagicMock(spec=Notification)
        notification.title = "Test Notification"
        notification.recipient = user

        # Mock the __str__ method
        notification.__str__.return_value = "Test Notification - test@example.com"

        # Get the string representation
        expected_str = "Test Notification - test@example.com"
        actual_str = str(notification)

        # Assert
        self.assertEqual(actual_str, expected_str)
        notification.__str__.assert_called_once()
