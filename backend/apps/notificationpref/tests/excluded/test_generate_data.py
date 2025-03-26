from apps.notificationpref.factories import UserNotificationPreferenceFactory

from unittest import TestCase 


class GenerateDataTests(TestCase):
    def test_generate_data(self):
        UserNotificationPreferenceFactory.create_batch(100)

