from django.test import TestCase

from apps.users.selectors import user_list
from apps.users.services import user_create


class UserGetTestCase(TestCase):
    def test_user_get_with_no_objects(self):
        users = user_list()

        self.assertIsNotNone(users)
        self.assertEqual(users.count(), 0)

    def test_user_get_with_objects(self):
        user_create(
            email="email@email.com",
            username="username",
            password="password",
            first_name="first_name",
            last_name="last_name",
        )

        user_list_result = user_list()

        self.assertEqual(user_list_result.count(), 1)
