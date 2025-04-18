from django.test import TestCase
from django.db import IntegrityError, transaction
from django.utils import timezone

from apps.notifications.models import Notification
from apps.notifications.services import notification_create
from apps.users.factories import BaseUserFactory


class TestNotificationTransaction(TestCase):
    """Test suite for the transaction behavior of notification services."""

    def setUp(self):
        """Setup data for each test method."""
        # Create test users
        self.user1 = BaseUserFactory(email="user1@example.com", first_name="Test", last_name="User1")

    def test_notification_create_transaction_rollback(self):
        """Test that transactions are rolled back when an error occurs."""
        # Count notifications before
        count_before = Notification.objects.count()
        
        # We'll create a scenario that will definitely cause an exception
        # by trying to create a notification with a NULL message
        # which should violate a NOT NULL constraint
        try:
            with transaction.atomic():
                # First create a valid notification
                notification_create(
                    recipient=self.user1,
                    message="This is a valid message",
                    notification_type="info"
                )
                
                # Then try to create an invalid one (with None for message)
                # This should be rolled back along with the valid one due to transaction.atomic
                notification_create(
                    recipient=self.user1,
                    message=None,  # This should cause a database integrity error
                    notification_type="info"
                )
                
            # If we get here, the test failed
            self.fail("Should have raised an exception")
        except (IntegrityError, ValueError):
            # Expected exception, now check that no notification was created
            # because the whole transaction should be rolled back
            count_after = Notification.objects.count()
            self.assertEqual(count_before, count_after, "Transaction didn't roll back properly")

    def test_nested_transaction_behavior(self):
        """Test nested transaction behavior with notification services."""
        # Count notifications before
        count_before = Notification.objects.count()
        
        # Create a notification in an outer transaction
        with transaction.atomic():
            notification1 = notification_create(
                recipient=self.user1,
                message="Outer transaction notification",
                notification_type="info"
            )
            
            # Try to create a notification in an inner transaction that will fail
            try:
                with transaction.atomic():
                    notification2 = notification_create(
                        recipient=self.user1,
                        message="Inner transaction notification",
                        notification_type="alert"
                    )
                    
                    # Force an error
                    raise ValueError("Forced error")
            except ValueError:
                # This exception is expected
                pass
                
        # Check the database state
        # The outer notification should exist, but the inner one should be rolled back
        notifications = Notification.objects.all()
        self.assertEqual(notifications.count(), count_before + 1)
        self.assertIn(notification1, notifications)
        
        # Check that notification2 doesn't exist in the database
        # We can't check directly because notification2 won't be defined
        # if the inner transaction raised an exception
        notifications_with_message = Notification.objects.filter(
            message="Inner transaction notification"
        )
        self.assertEqual(notifications_with_message.count(), 0)