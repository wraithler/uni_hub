from django.test import TestCase
from apps.users.factories import BaseUserFactory
from apps.communities.models import Community, CommunityCategory
from apps.notificationpref.models import UserNotificationPreference 
from apps.notificationpref.services import create_notification_preference, update_notification_preference
from django.db import IntegrityError


class NotificationPreferenceServiceTests(TestCase):
    def setUp(self):
        self.user = BaseUserFactory.create()
        
        # Manually create required related models first
        self.category = CommunityCategory.objects.create(
            name="Test Category"
        )
        
        # Manually create community with only existing fields
        self.community = Community.objects.create(
            name="Test Community",
            description="Test Description",
            category=self.category,
            created_by=self.user,
            is_featured=False,
            about="Test About"
        )

    def test_preference_auto_created(self):
        """Verify the user already has a preference"""
        # Check through the UserNotificationPreference model
        pref = UserNotificationPreference.objects.filter(user=self.user).first()
        self.assertIsNotNone(pref, "Notification preference should be auto-created")

    def test_update_existing_preference(self):
        """Test updating the auto-created preference"""
        # Get the existing preference
        pref = UserNotificationPreference.objects.get(user=self.user)
        
        # Test modifying existing preference
        updated_pref = update_notification_preference(
            user=self.user,
            data={'email_notifications': False}
        )
        self.assertEqual(updated_pref, pref)
        self.assertFalse(updated_pref.email_notifications)
    
    def test_create_when_none_exists(self):
        """Test creation when no preference exists"""
        # Ensure no preference exists
        UserNotificationPreference.objects.filter(user=self.user).delete()
        
        pref = create_notification_preference(user=self.user)
        self.assertEqual(pref.user, self.user)
        self.assertTrue(pref.email_notifications)
    
    def test_create_with_communities(self):
        """Test creation with community subscriptions"""
        # Clear any existing preference
        UserNotificationPreference.objects.filter(user=self.user).delete()
        
        pref = create_notification_preference(
            user=self.user,
            subscribed_communities=[self.community]
        )
        self.assertEqual(pref.subscribed_communities.count(), 1)
