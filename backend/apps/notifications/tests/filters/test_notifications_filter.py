import unittest
from unittest.mock import patch, MagicMock
from django.db.models import Q

from apps.notifications.filters import NotificationFilter


class TestNotificationFilters(unittest.TestCase):
    def setUp(self):
        # Setup mock queryset
        self.queryset = MagicMock()

        # Create an instance of the filter
        self.filter = NotificationFilter(data={}, queryset=self.queryset)

        # Mock filter methods
        self.boolean_filter_mock = patch("django_filters.BooleanFilter.filter").start()
        self.char_filter_mock = patch("django_filters.CharFilter.filter").start()
        self.date_filter_mock = patch(
            "django_filters.DateFromToRangeFilter.filter"
        ).start()

    def tearDown(self):
        patch.stopall()

    def test_is_read_filter(self):
        """Test filtering by is_read"""
        # Setup
        self.boolean_filter_mock.return_value = self.queryset

        # Execute
        result = self.filter.filters["is_read"].filter(self.queryset, True)

        # Assert
        self.boolean_filter_mock.assert_called_once_with(self.queryset, True)
        self.assertEqual(result, self.queryset)

    def test_notification_type_filter(self):
        """Test filtering by notification_type"""
        # Setup
        self.char_filter_mock.return_value = self.queryset

        # Execute
        result = self.filter.filters["notification_type"].filter(self.queryset, "info")

        # Assert
        self.char_filter_mock.assert_called_once_with(self.queryset, "info")
        self.assertEqual(result, self.queryset)

    def test_recipient_email_filter(self):
        """Test filtering by recipient__email"""
        # Setup
        self.char_filter_mock.return_value = self.queryset

        # Execute
        result = self.filter.filters["recipient__email"].filter(
            self.queryset, "test@example.com"
        )

        # Assert
        self.char_filter_mock.assert_called_once_with(self.queryset, "test@example.com")
        self.assertEqual(result, self.queryset)

    def test_created_at_filter(self):
        """Test filtering by created_at date range"""
        # Setup
        self.date_filter_mock.return_value = self.queryset

        # Execute
        result = self.filter.filters["created_at"].filter(
            self.queryset, ("2023-01-01", "2023-12-31")
        )

        # Assert
        self.date_filter_mock.assert_called_once_with(
            self.queryset, ("2023-01-01", "2023-12-31")
        )
        self.assertEqual(result, self.queryset)

    def test_filter_fields(self):
        """Test that the filter has all expected fields"""
        # Check that all expected fields are defined
        expected_fields = [
            "id",
            "is_read",
            "notification_type",
            "recipient",
            "recipient__email",
            "created_at",
        ]

        for field in expected_fields:
            self.assertIn(field, self.filter.Meta.fields)
