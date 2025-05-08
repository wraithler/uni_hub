import unittest
from unittest.mock import patch, MagicMock
from django.contrib.contenttypes.models import ContentType

from apps.notifications.signals import (
    handle_post_created,
    handle_comment_created,
    handle_like_created,
    handle_event_created,
)


class TestNotificationSignals(unittest.TestCase):
    def setUp(self):
        # Create user mock
        self.user = MagicMock()
        self.user.id = 1
        self.user.email = "test@example.com"
        self.user.first_name = "Test"
        self.user.last_name = "User"

        # Mock post
        self.post = MagicMock()
        self.post.id = 1
        self.post.content = "Test post content"
        self.post.created_by = self.user

        # Mock community
        self.community = MagicMock()
        self.community.id = 1
        self.community.name = "Test Community"

        # Mock community memberships
        member1 = MagicMock()
        member1.id = 2
        member1.first_name = "Member"
        member1.last_name = "One"
        member1.user = member1

        member2 = MagicMock()
        member2.id = 3
        member2.first_name = "Member"
        member2.last_name = "Two"
        member2.user = member2

        self.community.memberships = MagicMock()
        self.community.memberships.all.return_value = [member1, member2]

        # Mock comment
        self.comment = MagicMock()
        self.comment.id = 1
        self.comment.content = "Test comment"
        self.comment.post = self.post

        # Create a separate user for commenter
        commenter = MagicMock()
        commenter.id = 2
        commenter.first_name = "Test"
        commenter.last_name = "Commenter"
        self.comment.created_by = commenter

        # Mock like
        self.like = MagicMock()
        self.like.id = 1

        # Create a separate user for liker
        liker = MagicMock()
        liker.id = 2
        liker.first_name = "Test"
        liker.last_name = "Liker"
        self.like.user = liker

        # Set content object to post
        self.like.content_object = self.post

        # Mock event
        self.event = MagicMock()
        self.event.id = 1
        self.event.title = "Test Event"
        self.event.organizer = self.user
        self.event.community = self.community

        # Mock date for event
        self.event.starts_at = MagicMock()
        self.event.starts_at.strftime.return_value = "Jan 1, 2025"

        # Mock attendees
        attendee1 = MagicMock()
        attendee1.id = 2
        attendee1.first_name = "Attendee"
        attendee1.last_name = "One"

        attendee2 = MagicMock()
        attendee2.id = 3
        attendee2.first_name = "Attendee"
        attendee2.last_name = "Two"

        self.event.attendees = MagicMock()
        self.event.attendees.all.return_value = [attendee1, attendee2]

        # Setup notification create mock
        self.notification_create_mock = patch(
            "apps.notifications.signals.notification_create"
        ).start()
        self.mock_notification = MagicMock()
        self.notification_create_mock.return_value = self.mock_notification

        # Setup ContentType mock to avoid database access
        self.content_type_mock = patch(
            "django.contrib.contenttypes.models.ContentType.objects.get_for_model"
        ).start()
        self.mock_content_type = MagicMock()
        self.content_type_mock.return_value = self.mock_content_type

    def tearDown(self):
        patch.stopall()

    def test_handle_post_created_signal(self):
        """Test handling post creation signal"""
        # Setup
        self.post.community = self.community

        # Execute - simulate post_save signal with created=True
        handle_post_created(sender=None, instance=self.post, created=True)

        # Assert
        # Should be called once for each community member (2)
        self.assertEqual(self.notification_create_mock.call_count, 2)

        # Get the first call
        args, kwargs = self.notification_create_mock.call_args_list[0]

        # Check that notification was created with correct args
        self.assertEqual(kwargs["notification_type"], "info")
        self.assertEqual(kwargs["content_object"], self.post)
        self.assertIn("New post in", kwargs["title"])
        self.assertIn(
            f"{self.post.created_by.first_name} {self.post.created_by.last_name}",
            kwargs["message"],
        )

    def test_handle_comment_created_signal(self):
        """Test handling comment creation signal"""
        # Execute - simulate post_save signal with created=True
        handle_comment_created(sender=None, instance=self.comment, created=True)

        # Assert
        self.notification_create_mock.assert_called_once()

        # Check that notification was created with correct args
        args, kwargs = self.notification_create_mock.call_args
        self.assertEqual(kwargs["recipient"], self.post.created_by)
        self.assertEqual(kwargs["notification_type"], "info")
        self.assertEqual(kwargs["content_object"], self.comment)
        self.assertIn("New comment", kwargs["title"])
        self.assertIn(
            f"{self.comment.created_by.first_name} {self.comment.created_by.last_name}",
            kwargs["message"],
        )

    def test_handle_like_created_signal(self):
        """Test handling like creation signal"""
        # Execute - simulate post_save signal with created=True
        handle_like_created(sender=None, instance=self.like, created=True)

        # Assert
        self.notification_create_mock.assert_called_once()

        # Check that notification was created with correct args
        args, kwargs = self.notification_create_mock.call_args
        self.assertEqual(kwargs["recipient"], self.post.created_by)
        self.assertEqual(kwargs["notification_type"], "info")
        self.assertEqual(kwargs["content_object"], self.post)
        self.assertIn("Someone liked", kwargs["title"])
        self.assertIn(
            f"{self.like.user.first_name} {self.like.user.last_name}", kwargs["message"]
        )

    def test_handle_event_created_signal(self):
        """Test handling event creation signal"""
        # Execute - simulate post_save signal with created=True
        handle_event_created(sender=None, instance=self.event, created=True)

        # Assert
        # Should be called once for each community member (2)
        self.assertEqual(self.notification_create_mock.call_count, 2)

        # Get the first call
        args, kwargs = self.notification_create_mock.call_args_list[0]

        # Check that notification was created with correct args
        self.assertEqual(kwargs["notification_type"], "info")
        self.assertEqual(kwargs["content_object"], self.event)
        self.assertIn("New event", kwargs["title"])
        self.assertIn(self.event.title, kwargs["message"])

    def test_handle_event_updated_signal(self):
        """Test handling event update signal"""
        # Execute - simulate post_save signal with created=False (update)
        handle_event_created(sender=None, instance=self.event, created=False)

        # Assert
        # Should be called once for each attendee (2)
        self.assertEqual(self.notification_create_mock.call_count, 2)

        # Get the first call
        args, kwargs = self.notification_create_mock.call_args_list[0]

        # Check that notification was created with correct args
        self.assertEqual(kwargs["notification_type"], "info")
        self.assertEqual(kwargs["content_object"], self.event)
        self.assertIn("Event update", kwargs["title"])
        self.assertIn("details have been updated", kwargs["message"])
