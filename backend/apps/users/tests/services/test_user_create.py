from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.users.models import BaseUser
from apps.users.services import user_create


class UserCreateTests(TestCase):
    def test_user_without_password_is_created_with_unusable_one(self):
        user = user_create(email="test_user@email.com")

        self.assertFalse(user.has_usable_password())

    def test_email_unique_with_capitals(self):
        user_create(email="test_user@email.com")

        with self.assertRaises(ValidationError):
            user_create(email="TEST_USER@email.com")

        self.assertEqual(1, BaseUser.objects.count())
