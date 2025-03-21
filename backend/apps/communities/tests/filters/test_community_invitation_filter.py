from django.test import TestCase

from apps.communities.factories import CommunityFactory, CommunityInvitationFactory
from apps.communities.selectors import community_invitation_list
from apps.users.factories import BaseUserFactory


class CommunityInvitationFilterTests(TestCase):
    def test_community_invitation_filter_by_user(self):
        user1, user2 = BaseUserFactory.create_batch(2)

        CommunityInvitationFactory.create_batch(5, user=user1)
        CommunityInvitationFactory.create_batch(5, user=user2)

        invitations_user1 = community_invitation_list(filters={"user": user1})
        invitations_user2 = community_invitation_list(filters={"user": user2})

        self.assertEqual(len(invitations_user1), 5)
        self.assertEqual(len(invitations_user2), 5)

    def test_community_invitation_filter_by_community(self):
        community1, community2 = CommunityFactory.create_batch(2)

        CommunityInvitationFactory.create_batch(5, community=community1)
        CommunityInvitationFactory.create_batch(5, community=community2)

        invitations_community1 = community_invitation_list(
            filters={"community": community1}
        )
        invitations_community2 = community_invitation_list(
            filters={"community": community2}
        )

        self.assertEqual(len(invitations_community1), 5)
        self.assertEqual(len(invitations_community2), 5)
