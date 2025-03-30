from django.test import TestCase
from apps.notificationpref.models import UserNotificationPreference
from apps.notificationpref.filters import UserNotificationPreferenceFilter
from apps.users.factories import BaseUserFactory



class UserNotificationPreferenceTestCase(TestCase):
    def setUp(self):
        UserNotificationPreference.objects.all().delete()


    def test_filter_by_email_notifications(self):
        user = BaseUserFactory.create()
        
        preference, created = UserNotificationPreference.objects.get_or_create(
            user=user,
            defaults={
                'email_notifications': True,
                'event_updates': False
            }
        )

        if not created:
            preference.event_updates = False
            preference.save()

        
        filtered = UserNotificationPreferenceFilter(
            {'email_notifications': True}, 
            queryset=UserNotificationPreference.objects.all()
        ).qs
        
        self.assertEqual(filtered.count(), 1)  
        self.assertEqual(filtered.first().user, user) 
        self.assertTrue(filtered.first().email_notifications) 
        self.assertFalse(filtered.first().event_updates) 