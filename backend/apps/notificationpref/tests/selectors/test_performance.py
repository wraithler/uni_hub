from django.test import TransactionTestCase
from django.test.utils import CaptureQueriesContext
from django.db import connection
from apps.notificationpref.selectors import get_user_notification_preference
from apps.users.factories import BaseUserFactory

class PreferencePerformanceTests(TransactionTestCase):
    reset_sequences = True

    def test_query_count(self):
        user = BaseUserFactory.create()
        
        with CaptureQueriesContext(connection) as queries:
            result = get_user_notification_preference(user=user)
            self.assertEqual(len(queries), 1)