import unittest
from django.test import TestCase
from unittest.mock import patch, MagicMock, PropertyMock
from apps.notifications.selectors import (
    notification_list_by_user,
    notification_list_unread_by_user,
    notification_get,
    notification_count,
)


class TestNotificationSelectors(unittest.TestCase):
    def setUp(self):
        self.user = MagicMock()
        self.user.id = 1
        self.user.email = "test@example.com"

        self.notification = MagicMock()
        self.notification.id = 1
        self.notification.title = "Test Notification"

        # Setup mock functions
        self.notification_filter_mock = patch(
            "apps.notifications.selectors.Notification.objects.filter"
        ).start()
        self.notification_get_mock = patch(
            "apps.notifications.selectors.Notification.objects.get"
        ).start()

    def tearDown(self):
        patch.stopall()

    def test_notification_list_by_user(self):
        """Test listing notifications by user"""
        # Setup
        mock_queryset = MagicMock()
        self.notification_filter_mock.return_value = mock_queryset
        mock_queryset.order_by.return_value = [self.notification]

        # Execute
        result = notification_list_by_user(user=self.user)

        # Assert
        self.notification_filter_mock.assert_called_once_with(recipient=self.user)
        mock_queryset.order_by.assert_called_once_with("-created_at")
        self.assertEqual(result, [self.notification])

    def test_notification_list_unread_by_user(self):
        """Test listing unread notifications by user"""
        # Setup
        mock_queryset = MagicMock()
        self.notification_filter_mock.return_value = mock_queryset
        mock_queryset.order_by.return_value = [self.notification]

        # Execute
        result = notification_list_unread_by_user(user=self.user)

        # Assert
        self.notification_filter_mock.assert_called_once_with(
            recipient=self.user, is_read=False
        )
        mock_queryset.order_by.assert_called_once_with("-created_at")
        self.assertEqual(result, [self.notification])

    def test_notification_get_success(self):
        """Test successfully getting a specific notification"""
        # Setup
        self.notification_get_mock.return_value = self.notification

        # Execute
        result = notification_get(user=self.user, notification_id=1)

        # Assert
        self.notification_get_mock.assert_called_once_with(recipient=self.user, id=1)
        self.assertEqual(result, self.notification)

    def test_notification_get_not_found(self):
        """Test getting a notification that doesn't exist"""
        # Setup - make the get method throw DoesNotExist
        from django.core.exceptions import ObjectDoesNotExist

        self.notification_get_mock.side_effect = ObjectDoesNotExist()

        # Execute
        with patch(
            "apps.notifications.selectors.Notification.DoesNotExist", ObjectDoesNotExist
        ):
            result = notification_get(user=self.user, notification_id=999)

        # Assert
        self.notification_get_mock.assert_called_once_with(recipient=self.user, id=999)
        self.assertIsNone(result)

    def test_notification_count(self):
        """Test counting unread notifications"""
        # Setup
        mock_queryset = MagicMock()
        self.notification_filter_mock.return_value = mock_queryset
        mock_queryset.count.return_value = 5

        # Execute
        result = notification_count(user=self.user)

        # Assert
        self.notification_filter_mock.assert_called_once_with(
            recipient=self.user, is_read=False
        )
        mock_queryset.count.assert_called_once()
        self.assertEqual(result, 5)
