from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient

from apps.notifications.models import Notification
from apps.notifications.filters import NotificationFilter
from apps.users.factories import BaseUserFactory


class TestNotificationFilter(TestCase):
    """Test suite for the Notification filter functionality."""

    def setUp(self):
        """Setup data for each test method."""
        # Create users with email instead of username
        self.user1 = BaseUserFactory(email="user1@example.com", first_name="Test", last_name="User1")
        self.user2 = BaseUserFactory(email="user2@example.com", first_name="Test", last_name="User2")
        
        # Create notifications with various attributes for filtering tests
        self.notification1 = Notification.objects.create(
            recipient=self.user1,
            message="Test message 1",
            notification_type="info",
            is_read=False,
            created_at=timezone.now() - timedelta(days=5)
        )
        
        self.notification2 = Notification.objects.create(
            recipient=self.user1,
            message="Test message 2",
            notification_type="alert",
            is_read=True,
            created_at=timezone.now() - timedelta(days=3)
        )
        
        self.notification3 = Notification.objects.create(
            recipient=self.user2,
            message="Test message 3",
            notification_type="reminder",
            is_read=False,
            created_at=timezone.now() - timedelta(days=1)
        )
        
        self.notification4 = Notification.objects.create(
            recipient=self.user2,
            message="Test message 4",
            notification_type="promo",
            is_read=True,
            created_at=timezone.now()
        )
        
        # Create client
        self.client = APIClient()

    def test_filter_by_id(self):
        """Test filtering notifications by ID."""
        # Create filter instance with id filter
        filter_data = {'id': self.notification1.id}
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 1)
        self.assertEqual(result.first(), self.notification1)

    def test_filter_by_is_read(self):
        """Test filtering notifications by read status."""
        # Test for read notifications
        filter_data = {'is_read': True}
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 2)
        self.assertSetEqual(set(result), {self.notification2, self.notification4})
        
        # Test for unread notifications
        filter_data = {'is_read': False}
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 2)
        self.assertSetEqual(set(result), {self.notification1, self.notification3})

    def test_filter_by_notification_type(self):
        """Test filtering notifications by type."""
        # Test for 'info' notifications
        filter_data = {'notification_type': 'info'}
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 1)
        self.assertEqual(result.first(), self.notification1)
        
        # Test for partial match (should match both 'info' and 'reminder')
        filter_data = {'notification_type': 'i'}
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 2)
        self.assertSetEqual(set(result), {self.notification1, self.notification3})  # info and reminder

    def test_filter_by_recipient(self):
        """Test filtering notifications by recipient."""
        # Test direct recipient filtering
        filter_data = {'recipient': self.user1.id}
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 2)
        self.assertSetEqual(set(result), {self.notification1, self.notification2})

    def test_filter_by_recipient_email(self):
        """Test filtering notifications by recipient email."""
        filter_data = {'recipient__email': 'user1@example.com'}
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 2)
        self.assertSetEqual(set(result), {self.notification1, self.notification2})
        
        # Test partial email match
        filter_data = {'recipient__email': 'user2'}
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 2)
        self.assertSetEqual(set(result), {self.notification3, self.notification4})

    def test_filter_by_created_at(self):
        """Test filtering notifications by created date range."""
        # Test for notifications created in the last 2 days
        two_days_ago = timezone.now() - timedelta(days=2)
        filter_data = {'created_at_after': two_days_ago.strftime('%Y-%m-%d')}
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 2)
        self.assertSetEqual(set(result), {self.notification3, self.notification4})
        
        # Test for notifications created between 6 days ago and 4 days ago
        six_days_ago = timezone.now() - timedelta(days=6)
        four_days_ago = timezone.now() - timedelta(days=4)
        filter_data = {
            'created_at_after': six_days_ago.strftime('%Y-%m-%d'),
            'created_at_before': four_days_ago.strftime('%Y-%m-%d')
        }
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 1)
        self.assertEqual(result.first(), self.notification1)

    def test_multiple_filters(self):
        """Test applying multiple filters simultaneously."""
        filter_data = {
            'is_read': False,
            'recipient__email': 'user1@example.com'
        }
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 1)
        self.assertEqual(result.first(), self.notification1)

    def test_empty_filter(self):
        """Test with empty filter (should return all)."""
        filter_data = {}
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 4)
        self.assertSetEqual(set(result), {self.notification1, self.notification2, self.notification3, self.notification4})

    def test_no_results_filter(self):
        """Test filter that returns no results."""
        filter_data = {
            'is_read': True,
            'notification_type': 'info'
        }
        qs = Notification.objects.all()
        f = NotificationFilter(filter_data, queryset=qs)
        result = f.qs
        
        self.assertEqual(result.count(), 0)