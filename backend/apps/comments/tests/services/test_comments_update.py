from django.test import TestCase
from apps.comments.factories import CommentFactory
from apps.comments.services import comment_update
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory


class CommentUpdateTests(TestCase):
    def test_comment_update_success_by_author(self):
        comment = CommentFactory.create(content="Old Comment")
        data = {"content": "Updated Comment", "user": comment.created_by}

        updated_comment = comment_update(comment=comment, data=data)

        self.assertEqual(updated_comment.content, "Updated Comment")

    def test_comment_update_failure_by_non_author(self):
        comment = CommentFactory.create()
        other_user = BaseUserFactory.create()
        data = {"content": "Updated Comment", "user": other_user}

        with self.assertRaises(ApplicationError):
            comment_update(comment=comment, data=data)
