from django.test import TransactionTestCase
from django.db import transaction
from apps.notificationpref.selectors import get_user_notification_preference
from apps.notificationpref.models import UserNotificationPreference
from apps.users.factories import BaseUserFactory
    
from django.test.utils import CaptureQueriesContext
from django.db import connection

class NotificationPreferenceSelectorsTestCase(TransactionTestCase):
    reset_sequences = True  # Helps prevent unique constraint issues

    def setUp(self):
        # Clear all existing data to prevent conflicts
        UserNotificationPreference.objects.all().delete()
        BaseUserFactory._meta.model.objects.all().delete()

    def test_get_user_notification_preference_success(self):
        """Test retrieving existing preferences"""
        # Just create the user - the preference is automatically created by BaseUserFactory
        with transaction.atomic():
            user = BaseUserFactory.create()
        
        # Get the auto-created preference
        auto_created_pref = UserNotificationPreference.objects.get(user=user)
        
        # Test the selector
        result = get_user_notification_preference(user=user)
        self.assertEqual(result, auto_created_pref)
        self.assertEqual(result.user, user)
        # Verify fields exist (values depend on your default settings)
        self.assertIsInstance(result.email_notifications, bool)
        self.assertIsInstance(result.event_updates, bool)

    def test_get_user_notification_preference_not_found(self):
        """Test handling of missing preferences"""
        # Create user and then delete its auto-created preference
        with transaction.atomic():
            new_user = BaseUserFactory.create()
            # Remove the auto-created preference
            UserNotificationPreference.objects.filter(user=new_user).delete()
        
        # Verify test setup
        self.assertFalse(
            UserNotificationPreference.objects.filter(user=new_user).exists(),
            "Test setup failed - preference exists for new user"
        )
        
        # Test selector
        with self.assertRaises(Exception) as context:
            get_user_notification_preference(user=new_user)
        
        self.assertIn("No preferences found", str(context.exception))
    
    
    def test_multiple_users_preferences(self):
        """Test selector with multiple users"""
        users = [BaseUserFactory.create() for _ in range(3)]
        prefs = [UserNotificationPreference.objects.get(user=user) for user in users]
        
        for user, expected_pref in zip(users, prefs):
            result = get_user_notification_preference(user=user)
            self.assertEqual(result, expected_pref)
    
    def test_updated_preferences(self):
        """Test selector returns updated preferences"""
        user = BaseUserFactory.create()
        original_pref = UserNotificationPreference.objects.get(user=user)
        
        # Update preferences
        original_pref.email_notifications = False
        original_pref.save()
        
        # Verify selector returns updated version
        result = get_user_notification_preference(user=user)
        self.assertFalse(result.email_notifications)
        self.assertEqual(result.updated_at, original_pref.updated_at)


    def test_query_count(self):
        """Test the number of database queries"""
        user = BaseUserFactory.create()
        
        with CaptureQueriesContext(connection) as queries:
            result = get_user_notification_preference(user=user)
            self.assertEqual(len(queries), 1)  # Should only make one query