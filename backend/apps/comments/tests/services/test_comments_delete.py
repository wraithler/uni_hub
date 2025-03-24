from django.test import TestCase
from apps.comments.models import Comment
from apps.comments.factories import CommentFactory
from apps.comments.services import comment_delete
from apps.core.exceptions import ApplicationError
from apps.users.factories import BaseUserFactory


class CommentDeleteTests(TestCase):
    def test_comment_delete_success_by_author(self):
        comment = CommentFactory.create()
        comment_delete(comment=comment, user=comment.created_by)

        self.assertFalse(Comment.objects.filter(id=comment.id).exists())

    def test_comment_delete_failure_by_non_author(self):
        comment = CommentFactory.create()
        other_user = BaseUserFactory.create()

        with self.assertRaises(ApplicationError):
            comment_delete(comment=comment, user=other_user)
