from django.test import TestCase
from apps.reactions.factories import CommentFactory
from apps.users.factories import BaseUserFactory
from apps.reactions.selectors import comment_list_by_user


class CommentListByUserTests(TestCase):
    def test_comment_list_by_user(self):
        user = BaseUserFactory.create()
        CommentFactory.create_batch(4, created_by=user)
        CommentFactory.create_batch(2)  # Comments by other users
        comments = comment_list_by_user(user_id=user.id)
        self.assertEqual(comments.count(), 4)
