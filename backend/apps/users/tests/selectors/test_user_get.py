from django.test import TestCase

from apps.users.selectors import user_get
from apps.users.services import user_create


class UserGetTestCase(TestCase):
    def test_user_get_with_no_objects(self):
        user = user_get(1)

        self.assertIsNone(user)

    def test_user_get_with_objects(self):
        user = user_create(
            email="email@email.com",
            username="username",
            password="password",
            first_name="first_name",
            last_name="last_name",
        )

        user_get_result = user_get(user.id)

        self.assertIsNotNone(user_get_result)
