from django.test import TestCase
from apps.comments.factories import CommentFactory
from apps.comments.selectors import comment_list


class CommentListTests(TestCase):
    def test_comment_list_without_filters(self):
        CommentFactory.create_batch(5)
        comments = comment_list(filters={})
        self.assertEqual(comments.count(), 5)

    def test_comment_list_with_filters(self):
        CommentFactory.create(content="Specific Comment")
        CommentFactory.create(content="Another Comment")
        comments = comment_list(filters={"content": "Specific Comment"})
        self.assertEqual(comments.count(), 1)
        self.assertEqual(comments.first().content, "Specific Comment")
