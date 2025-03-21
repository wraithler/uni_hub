from django.test import TestCase

from apps.users.services import user_create, user_update


class UserUpdateTests(TestCase):
    def test_user_update(self):
        user = user_create(
            email="test_user@gmail.com",
            username="test_user",
            first_name="Test",
            last_name="User",
            password="password",
        )

        user = user_update(user=user, data={"first_name": "Test2"})

        self.assertEqual("Test2", user.first_name)
