from django.test import TestCase
from unittest.mock import patch, MagicMock, PropertyMock
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType

from apps.notifications.models import Notification
from apps.notifications.services import (
    get_user_preferences,
    should_send_notification,
    notification_create,
    notification_create_batch,
    notification_mark_as_read,
    notification_mark_all_as_read,
    notification_delete,
    notification_delete_all
)
from apps.notification_preferences.models import UserNotificationPreference


class TestNotificationServices(TestCase):
    def setUp(self):
        # Create mock user
        self.user = MagicMock()
        self.user.id = 1
        self.user.email = "test@example.com"
        
        # Create mock content object
        self.content_object = MagicMock()
        self.content_object.id = 1
        
        # Create mock preference
        self.preference = MagicMock(spec=UserNotificationPreference)
        self.preference.email_notifications = True
        self.preference.in_app_notifications = True
        self.preference.post_notifications = True
        self.preference.event_updates = True
        self.preference.announcements = True
        
        # Mock ContentType
        self.content_type_mock = patch('django.contrib.contenttypes.models.ContentType.objects.get_for_model').start()
        self.mock_content_type = MagicMock()
        self.content_type_mock.return_value = self.mock_content_type
        
        # Mock Notification.objects.create
        self.notification_create_mock = patch('apps.notifications.models.Notification.objects.create').start()
        self.mock_notification = MagicMock()
        self.notification_create_mock.return_value = self.mock_notification
        
        # Mock Notification.objects methods
        self.notification_filter_mock = patch('apps.notifications.models.Notification.objects.filter').start()
        self.notification_get_mock = patch('apps.notifications.models.Notification.objects.get').start()
        
        # Mock filter queryset
        self.mock_queryset = MagicMock()
        self.notification_filter_mock.return_value = self.mock_queryset
        self.mock_queryset.update.return_value = 3  # Mock updated count
        self.mock_queryset.delete.return_value = (3, {})  # Mock deleted count
    
    def tearDown(self):
        patch.stopall()
    
    def test_get_user_preferences_success(self):
        """Test successfully getting user preferences"""
        # Setup - mock user with notification_preferences property
        user = MagicMock()
        preferences = MagicMock()
        
        # Setup the notification_preferences property to return the mock
        user.notification_preferences = preferences
        
        # Execute
        result = get_user_preferences(user)
        
        # Assert
        self.assertEqual(result, preferences)
    
    def test_get_user_preferences_not_found(self):
        """Test getting user preferences when they don't exist"""
        # Setup
        user = MagicMock()
        
        # Create a DoesNotExist exception for UserNotificationPreference
        does_not_exist = type('DoesNotExist', (Exception,), {})
        UserNotificationPreference.DoesNotExist = does_not_exist
        
        # Configure the property to raise the exception
        type(user).notification_preferences = PropertyMock(side_effect=UserNotificationPreference.DoesNotExist())
        
        # Execute
        result = get_user_preferences(user)
        
        # Assert
        self.assertIsNone(result)
    
    def test_should_send_notification_with_preferences(self):
        """Test checking if notification should be sent based on preferences"""
        # Setup
        user = MagicMock()
        preference = MagicMock()
        preference.post_notifications = True
        preference.in_app_notifications = True
        
        with patch('apps.notifications.services.get_user_preferences', return_value=preference):
            # Execute
            result = should_send_notification(user, 'post', 'in_app')
            
            # Assert
            self.assertTrue(result)
    
    def test_should_send_notification_disabled_type(self):
        """Test notification check when type is disabled"""
        # Setup
        user = MagicMock()
        preference = MagicMock()
        preference.post_notifications = False
        preference.in_app_notifications = True
        
        with patch('apps.notifications.services.get_user_preferences', return_value=preference):
            # Execute
            result = should_send_notification(user, 'post', 'in_app')
            
            # Assert
            self.assertFalse(result)
    
    def test_should_send_notification_disabled_channel(self):
        """Test notification check when channel is disabled"""
        # Setup
        user = MagicMock()
        preference = MagicMock()
        preference.post_notifications = True
        preference.in_app_notifications = False
        
        with patch('apps.notifications.services.get_user_preferences', return_value=preference):
            # Execute
            result = should_send_notification(user, 'post', 'in_app')
            
            # Assert
            self.assertFalse(result)
    
    def test_should_send_notification_no_preferences(self):
        """Test notification check with no preferences (defaults to True)"""
        # Setup
        user = MagicMock()
        
        with patch('apps.notifications.services.get_user_preferences', return_value=None):
            # Execute
            result = should_send_notification(user, 'post', 'in_app')
            
            # Assert
            self.assertTrue(result)
    
    def test_notification_create(self):
        """Test creating a notification"""
        # Setup
        with patch('apps.notifications.services.should_send_notification', return_value=True):
            # Execute
            notification = notification_create(
                recipient=self.user,
                notification_type='info',
                message="Test notification",
                title="Test Title",
                content_object=self.content_object,
                channel='in_app'
            )
            
            # Assert
            self.notification_create_mock.assert_called_once()
            self.assertEqual(notification, self.mock_notification)
    
    def test_notification_create_disabled(self):
        """Test creating a notification when it's disabled by preferences"""
        # Setup
        with patch('apps.notifications.services.should_send_notification', return_value=False):
            # Execute
            notification = notification_create(
                recipient=self.user,
                notification_type='info',
                message="Test notification",
                title="Test Title",
                content_object=None,
                channel='in_app'
            )
            
            # Assert
            self.notification_create_mock.assert_not_called()
            self.assertIsNone(notification)
    
    def test_notification_create_batch(self):
        """Test creating a batch of notifications"""
        # Setup
        channels = ['in_app', 'email']
        
        with patch('apps.notifications.services.should_send_notification', return_value=True):
            # Execute
            notifications = notification_create_batch(
                recipient=self.user,
                notification_type='info',
                content_object=self.content_object,
                message="Test notification",
                title="Test Title",
                channels=channels
            )
            
            # Assert
            self.assertEqual(self.notification_create_mock.call_count, len(channels))
            self.assertEqual(len(notifications), len(channels))
    
    def test_notification_create_batch_respects_preferences(self):
        """Test batch creation respects user preferences"""
        # Setup
        channels = ['in_app', 'email']
        
        def side_effect(user, notification_type, channel):
            return channel == 'in_app'  # Only allow in_app notifications
        
        with patch('apps.notifications.services.should_send_notification', side_effect=side_effect):
            # Execute
            notifications = notification_create_batch(
                recipient=self.user,
                notification_type='info',
                content_object=self.content_object,
                message="Test notification",
                title="Test Title",
                channels=channels
            )
            
            # Assert
            self.assertEqual(self.notification_create_mock.call_count, 1)  # Only in_app notification created
            self.assertEqual(len(notifications), 1)
    
    def test_notification_mark_as_read(self):
        """Test marking a notification as read"""
        # Setup
        notification = MagicMock()
        self.notification_get_mock.return_value = notification
        
        # Execute
        result = notification_mark_as_read(notification_id=1)
        
        # Assert
        self.assertTrue(result)
        notification.mark_as_read.assert_called_once()
    
    def test_notification_mark_as_read_not_found(self):
        """Test marking a non-existent notification as read"""
        # Setup
        self.notification_get_mock.side_effect = Notification.DoesNotExist
        
        # Execute
        result = notification_mark_as_read(notification_id=1)
        
        # Assert
        self.assertFalse(result)
    
    def test_notification_mark_all_as_read(self):
        """Test marking all notifications as read"""
        # Setup
        self.mock_queryset.update.return_value = 3
        
        # Execute
        result = notification_mark_all_as_read(user=self.user)
        
        # Assert
        self.assertTrue(result)
        self.mock_queryset.update.assert_called_once()
    
    def test_notification_mark_all_as_read_none(self):
        """Test marking all notifications as read when none exist"""
        # Setup
        self.mock_queryset.update.return_value = 0
        
        # Execute
        result = notification_mark_all_as_read(user=self.user)
        
        # Assert
        self.assertFalse(result)
    
    def test_notification_delete(self):
        """Test deleting a notification"""
        # Setup
        notification = MagicMock()
        self.notification_get_mock.return_value = notification
        
        # Execute
        result = notification_delete(notification_id=1)
        
        # Assert
        self.assertTrue(result)
        notification.delete.assert_called_once()
    
    def test_notification_delete_not_found(self):
        """Test deleting a non-existent notification"""
        # Setup
        self.notification_get_mock.side_effect = Notification.DoesNotExist
        
        # Execute
        result = notification_delete(notification_id=1)
        
        # Assert
        self.assertFalse(result)
    
    def test_notification_delete_all(self):
        """Test deleting all notifications"""
        # Setup
        self.mock_queryset.delete.return_value = (3, {})
        
        # Execute
        result = notification_delete_all(user=self.user)
        
        # Assert
        self.assertTrue(result)
        self.mock_queryset.delete.assert_called_once()
    
    def test_notification_delete_all_none(self):
        """Test deleting all notifications when none exist"""
        # Setup
        self.mock_queryset.delete.return_value = (0, {})
        
        # Execute
        result = notification_delete_all(user=self.user)
        
        # Assert
        self.assertFalse(result)