from django.test import TestCase

from apps.communities.factories import CommunityFactory
from apps.communities.services import community_invitation_create
from apps.users.factories import BaseUserFactory


class CommunityInvitationTests(TestCase):
    def test_community_invitation_create(self):
        community = CommunityFactory.create()
        user = BaseUserFactory.create()

        invitation = community_invitation_create(community=community, user=user)

        self.assertIsNotNone(invitation)
        self.assertEqual(invitation.community, community)
        self.assertEqual(invitation.user, user)
        self.assertEqual(community.invitations.count(), 1)
        self.assertEqual(community.invitations.first(), invitation)
        self.assertEqual(user.invitations.count(), 1)
        self.assertEqual(user.invitations.first(), invitation)
        self.assertFalse(invitation.is_accepted)
