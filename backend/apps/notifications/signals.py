from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from apps.posts.models import Post
from apps.reactions.models import Comment, Like
from apps.events.models import Event, EventAttendee
from apps.communities.models import Community, CommunityMembership
from .services import notification_create


@receiver(post_save, sender=Post)
def handle_post_created(sender, instance, created, **kwargs):
    """Handle post creation and send notifications."""
    if created:
        # Notify community members about new post
        if hasattr(instance, 'community') and instance.community:
            for membership in instance.community.memberships.all():
                if membership.user != instance.created_by:  # Don't notify the author
                    notification_create(
                        recipient=membership.user,
                        notification_type='info',
                        title=f"New post in {instance.community.name}",
                        message=f"{instance.created_by.first_name} {instance.created_by.last_name} posted '{instance.content[:50]}...'",
                        content_object=instance
                    )


@receiver(post_save, sender=Comment)
def handle_comment_created(sender, instance, created, **kwargs):
    """Handle comment creation and send notifications."""
    if created and hasattr(instance, 'post'):
        # Notify post author about new comment
        if instance.post.created_by != instance.created_by:
            notification_create(
                recipient=instance.post.created_by,
                notification_type='info',
                title=f"New comment on your post",
                message=f"{instance.created_by.first_name} {instance.created_by.last_name} commented: '{instance.content[:50]}...'",
                content_object=instance
            )


@receiver(post_save, sender=Like)
def handle_like_created(sender, instance, created, **kwargs):
    """Handle like creation and send notifications."""
    if created and hasattr(instance, 'content_object'):
        # Get author of the liked content
        if hasattr(instance.content_object, 'created_by'):
            author = instance.content_object.created_by
        elif hasattr(instance.content_object, 'author'):
            author = instance.content_object.author
        else:
            return
            
        if author != instance.user:  # Don't notify self-likes
            content_type = ContentType.objects.get_for_model(instance.content_object)
            content_name = content_type.model
            
            notification_create(
                recipient=author,
                notification_type='info',
                title=f"Someone liked your {content_name}",
                message=f"{instance.user.first_name} {instance.user.last_name} liked your {content_name}",
                content_object=instance.content_object
            )


@receiver(post_save, sender=Event)
def handle_event_created(sender, instance, created, **kwargs):
    """Handle event creation and updates."""
    if created:
        # Notify community members about new event
        if hasattr(instance, 'community') and instance.community:
            for membership in instance.community.memberships.all():
                if membership.user != instance.created_by:  # Don't notify the creator
                    notification_create(
                        recipient=membership.user,
                        notification_type='info',
                        title=f"New event in {instance.community.name}",
                        message=f"New event: {instance.title} on {instance.starts_at.strftime('%b %d, %Y')}",
                        content_object=instance
                    )
    else:
        # Notify attendees about event updates
        for attendee in instance.attendees.all():
            if attendee.user != instance.created_by:  # Don't notify the creator
                notification_create(
                    recipient=attendee.user,
                    notification_type='info',
                    title=f"Event update: {instance.title}",
                    message=f"The event details have been updated",
                    content_object=instance
                )

@receiver(post_save, sender=EventAttendee)
def handle_event_attendee(sender, instance, created, **kwargs):
    """Handle event attendee creation and send notifications."""
    if created:
        notification_create(
            recipient=instance.user,
            notification_type='info',
            title=f"Confirmation: {instance.event.title}",
            message=f"You are now attending {instance.event.title} on {instance.event.starts_at.strftime('%b %d, %Y')}",
            content_object=instance.event
        )

#  handler for community membership
@receiver(post_save, sender=CommunityMembership)
def handle_community_membership(sender, instance, created, **kwargs):
    """Handle community membership creation."""
    if created:
        # Notify existing members about new member
        for membership in instance.community.memberships.all():
            if membership.user != instance.user:  # Don't notify the new member
                notification_create(
                    recipient=membership.user,
                    notification_type='info',
                    title=f"New member in {instance.community.name}",
                    message=f"{instance.user.first_name} {instance.user.last_name} has joined the community",
                    content_object=instance.community
                )