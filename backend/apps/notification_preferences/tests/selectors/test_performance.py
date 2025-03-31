from django.test import TransactionTestCase
from django.test.utils import CaptureQueriesContext
from django.db import connection
from apps.notification_preferences.selectors import user_notification_preference_get
from apps.users.factories import BaseUserFactory


class PreferencePerformanceTests(TransactionTestCase):
    reset_sequences = True

    def test_query_count(self):
        user = BaseUserFactory.create()

        with CaptureQueriesContext(connection) as queries:
            result = user_notification_preference_get(user=user)
            self.assertEqual(len(queries), 1)
