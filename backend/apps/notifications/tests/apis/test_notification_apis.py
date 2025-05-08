from rest_framework.test import APIRequestFactory
from rest_framework import status
from rest_framework.response import Response
from rest_framework.test import force_authenticate
from django.test import TestCase
from unittest.mock import MagicMock, patch
from apps.api.pagination import LimitOffsetPagination

from apps.notifications.apis import (
    NotificationListAPI,
    NotificationUnreadListAPI,
    NotificationMarkAsReadAPI,
    NotificationMarkAllAsReadAPI,
    NotificationDeleteAPI,
    NotificationDeleteAllAPI,
    NotificationCountAPI,
    NotificationSerializer,
)


class TestNotificationAPIs(TestCase):
    def setUp(self):
        # Create factory and user mock
        self.factory = APIRequestFactory()
        self.user = MagicMock()
        self.user.id = 1
        self.user.email = "test@example.com"

        # Create a mock notification
        self.notification = MagicMock()
        self.notification.id = 1
        self.notification.title = "Test Notification"
        self.notification.recipient = self.user

        # Setup mock functions
        self.notification_list_mock = patch(
            "apps.notifications.apis.notification_list_by_user"
        ).start()
        self.notification_unread_mock = patch(
            "apps.notifications.apis.notification_list_unread_by_user"
        ).start()
        self.notification_mark_mock = patch(
            "apps.notifications.apis.notification_mark_as_read"
        ).start()
        self.notification_mark_all_mock = patch(
            "apps.notifications.apis.notification_mark_all_as_read"
        ).start()
        self.notification_delete_mock = patch(
            "apps.notifications.apis.notification_delete"
        ).start()
        self.notification_delete_all_mock = patch(
            "apps.notifications.apis.notification_delete_all"
        ).start()
        self.notification_count_mock = patch(
            "apps.notifications.apis.notification_count"
        ).start()

        # Setup mock serializer
        self.serializer_mock = patch(
            "apps.notifications.apis.NotificationSerializer"
        ).start()
        self.serializer_instance = MagicMock()
        self.serializer_instance.data = {"id": 1, "title": "Test Notification"}
        self.serializer_mock.return_value = self.serializer_instance

    def tearDown(self):
        patch.stopall()

    def test_notification_list_api(self):
        """Test getting all notifications for a user"""
        # Setup
        self.notification_list_mock.return_value = [self.notification]
        request = self.factory.get("/notifications/")
        request.user = self.user

        # Execute
        view = NotificationListAPI()
        view.request = request
        response = view.get(request)

        # Assert
        self.notification_list_mock.assert_called_once_with(user=self.user)
        self.serializer_mock.assert_called_once_with([self.notification], many=True)
        self.assertEqual(response.data, self.serializer_instance.data)

    def test_notification_unread_list_api(self):
        """Test getting unread notifications for a user"""
        # Setup
        self.notification_unread_mock.return_value = [self.notification]
        request = self.factory.get("/notifications/unread/")
        request.user = self.user

        # Execute
        view = NotificationUnreadListAPI()
        view.request = request
        response = view.get(request)

        # Assert
        self.notification_unread_mock.assert_called_once_with(user=self.user)
        self.serializer_mock.assert_called_once_with([self.notification], many=True)
        self.assertEqual(response.data, self.serializer_instance.data)

    def test_notification_mark_as_read_api(self):
        """Test marking a notification as read"""
        # Setup
        self.notification_mark_mock.return_value = True
        request = self.factory.post("/notifications/1/mark-as-read/")
        request.user = self.user

        # Execute
        view = NotificationMarkAsReadAPI()
        view.request = request
        response = view.post(request, pk=1)

        # Assert
        self.notification_mark_mock.assert_called_once_with(notification_id=1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_notification_mark_as_read_api_not_found(self):
        """Test marking a notification as read when not found"""
        # Setup
        self.notification_mark_mock.return_value = False
        request = self.factory.post("/notifications/999/mark-as-read/")
        request.user = self.user

        # Execute
        view = NotificationMarkAsReadAPI()
        view.request = request
        response = view.post(request, pk=999)

        # Assert
        self.notification_mark_mock.assert_called_once_with(notification_id=999)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_notification_mark_all_as_read_api(self):
        """Test marking all notifications as read"""
        # Setup
        self.notification_mark_all_mock.return_value = True
        request = self.factory.post("/notifications/mark-all-as-read/")
        request.user = self.user

        # Execute
        view = NotificationMarkAllAsReadAPI()
        view.request = request
        response = view.post(request)

        # Assert
        self.notification_mark_all_mock.assert_called_once_with(user=self.user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_notification_delete_api(self):
        """Test deleting a notification"""
        # Setup
        self.notification_delete_mock.return_value = True
        request = self.factory.delete("/notifications/1/")
        request.user = self.user

        # Execute
        view = NotificationDeleteAPI()
        view.request = request
        response = view.delete(request, pk=1)

        # Assert
        self.notification_delete_mock.assert_called_once_with(notification_id=1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_notification_delete_api_not_found(self):
        """Test deleting a notification when not found"""
        # Setup
        self.notification_delete_mock.return_value = False
        request = self.factory.delete("/notifications/999/")
        request.user = self.user

        # Execute
        view = NotificationDeleteAPI()
        view.request = request
        response = view.delete(request, pk=999)

        # Assert
        self.notification_delete_mock.assert_called_once_with(notification_id=999)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_notification_delete_all_api(self):
        """Test deleting all notifications"""
        # Setup
        self.notification_delete_all_mock.return_value = True
        request = self.factory.delete("/notifications/delete-all/")
        request.user = self.user

        # Execute
        view = NotificationDeleteAllAPI()
        view.request = request
        response = view.delete(request)

        # Assert
        self.notification_delete_all_mock.assert_called_once_with(user=self.user)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_notification_count_api(self):
        """Test counting unread notifications"""
        # Setup
        self.notification_count_mock.return_value = 5
        request = self.factory.get("/notifications/count/")
        request.user = self.user

        # Execute
        view = NotificationCountAPI()
        view.request = request
        response = view.get(request)

        # Assert
        self.notification_count_mock.assert_called_once_with(user=self.user)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 5)
