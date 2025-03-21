from django.test import TestCase

from apps.communities.factories import CommunityInvitationFactory
from apps.communities.selectors import community_invitation_get


class CommunityInvitationGetTests(TestCase):
    def test_community_invitation_get_with_no_objects(self):
        community = community_invitation_get(1)

        self.assertIsNone(community)

    def test_community_invitation_get_with_objects(self):
        invitation = CommunityInvitationFactory.create()

        invitation_get_result = community_invitation_get(invitation.id)

        self.assertIsNotNone(invitation_get_result)