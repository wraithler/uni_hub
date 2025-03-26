from django.test import TestCase
from apps.comments.factories import CommentFactory
from apps.comments.selectors import comment_get


class CommentGetTests(TestCase):
    def test_comment_get_with_no_objects(self):
        comment = comment_get(1)
        self.assertIsNone(comment)

    def test_comment_get_with_objects(self):
        comment = CommentFactory.create(content="Test Comment")
        result = comment_get(comment.id)
        self.assertIsNotNone(result)
        self.assertEqual(result.content, "Test Comment")
