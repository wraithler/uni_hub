from django.utils import timezone

from api.models import (
    User,
    Community,
    CommunityCategory,
    Post,
    Comment,
    Events,
    EventAttendance,
    Notification,
    SearchHistory,
    SocialPlatforms,
    UserSocialLinks,
    PostLike,
    FriendRequest,
    Friend,
    PostView,
)


def create_mock_user(
    username="testuser", email="testemail@gmail.com", password="testpassword"
):
    return User.objects.create(username=username, email=email, password=password)


def create_mock_friend_for_user(
    user, username="testfriend", email="testfriend@gmail.com", password="testpassword"
):
    friend = create_mock_user(username, email, password)
    user.friends.add(friend)
    user.save()
    return friend


def create_mock_community_category(name="Test Category", description="Description"):
    return CommunityCategory.objects.create(name=name, description=description)


def create_mock_community(
    name="Test Community",
    description="Description",
    emoji="??",
    created_by=create_mock_user(),
    category=create_mock_community_category(),
):
    return Community.objects.create(
        name=name,
        description=description,
        emoji=emoji,
        created_by=created_by,
        category=category,
    )


def create_mock_post_for_community(
    community, created_by, title="Test Post", content="Content"
):
    return Post.objects.create(
        title=title,
        content=content,
        community=community,
        created_by=created_by,
    )


def create_mock_comment(post, content="Test Comment", created_by=None):
    if created_by is None:
        created_by = post.created_by
    return Comment.objects.create(content=content, post=post, created_by=created_by)


def create_mock_event(
    title="Test Event",
    description="Description",
    event_date=None,
    location="Test Location",
    created_by=create_mock_user(),
    community=create_mock_community(),
    virtual_event=False,
    virtual_link=None,
):
    if event_date is None:
        event_date = timezone.now()
    return Events.objects.create(
        title=title,
        description=description,
        event_date=event_date,
        location=location,
        created_by=created_by,
        community=community,
        virtual_event=virtual_event,
        virtual_link=virtual_link,
    )


def create_mock_event_attendance(event, user):
    return EventAttendance.objects.create(event=event, user=user)


def create_mock_notification(user, message="Test Notification"):
    return Notification.objects.create(user=user, message=message)


def create_mock_search_history(user, query="Test Query"):
    return SearchHistory.objects.create(user=user, query=query)


def create_mock_social_platform(name="Test Platform", url="http://testplatform.com"):
    return SocialPlatforms.objects.create(name=name, url=url)


def create_mock_user_social_link(user, platform, url="http://testuserlink.com"):
    return UserSocialLinks.objects.create(user=user, platform=platform, url=url)


def create_mock_post_like(post, user):
    return PostLike.objects.create(post=post, user=user)


def create_mock_friend_request(from_user, to_user):
    return FriendRequest.objects.create(from_user=from_user, to_user=to_user)


def create_mock_friend(user1, user2):
    return Friend.objects.create(user1=user1, user2=user2)


def create_mock_post_view(post, user):
    return PostView.objects.create(post=post, user=user)


def create_mock_post_comment(post, user, content="Test Comment"):
    return Comment.objects.create(post=post, created_by=user, content=content)
