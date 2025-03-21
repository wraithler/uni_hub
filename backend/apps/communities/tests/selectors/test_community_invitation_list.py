from django.test import TestCase

from apps.communities.factories import CommunityInvitationFactory
from apps.communities.selectors import community_invitation_list


class CommunityInvitationListTests(TestCase):
    def setUp(self):
        CommunityInvitationFactory.create_batch(10)

    def test_community_invitation_list(self):
        invitation = community_invitation_list()

        self.assertEqual(len(invitation), 10)
