from django.test import TestCase

from apps.communities.factories import CommunityFactory
from apps.communities.services import community_invitation_create, community_invitation_update
from apps.users.factories import BaseUserFactory


class CommunityInvitationUpdateTests(TestCase):
    def setUp(self):
        self.invitation = community_invitation_create(
            community=CommunityFactory.create(),
            user=BaseUserFactory.create(),
        )

    def test_community_invitation_update_valid_field(self):
        invitation = community_invitation_update(
            invitation=self.invitation, data={"is_accepted": True}
        )

        self.assertTrue(invitation.is_accepted)

    def test_community_invitation_update_invalid_field(self):
        invitation = community_invitation_update(
            invitation=self.invitation, data={"user": BaseUserFactory.create()}
        )

        self.assertEqual(invitation, self.invitation)