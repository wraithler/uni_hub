import { Accordion, Button, Flex, Group } from '@mantine/core';
import { useCommunityJoin } from '@/hooks/useCommunityJoin';
import { CommunityListItem } from '@/types/communities';

interface CommunityListAccordionProps {
  communities: CommunityListItem[];
}

function AccordionItem({ community }: { community: CommunityListItem }) {
  const { handleJoinCommunity } = useCommunityJoin();

  return (
    <Accordion.Item key={community.id} value={community.name}>
      <Accordion.Control icon={community.emoji}>{community.name}</Accordion.Control>
      <Accordion.Panel>
        <Flex direction="column" gap="md">
          {community.member_count} member{community.member_count !== 1 ? 's' : ''}
          {community.description}
          <Group gap="sm" justify="flex-end">
            <Button size="sm" variant="light">
              View page
            </Button>
            {community.is_private ? (
              <Button size="sm">Request to join</Button>
            ) : (
              <Button size="sm" onClick={() => handleJoinCommunity(community)}>
                Join
              </Button>
            )}
          </Group>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

function CommunityListAccordion({ communities }: CommunityListAccordionProps) {
  const items = communities.map((community) => (
    <AccordionItem community={community} key={community.id} />
  ));

  return (
    <Accordion variant="contained" radius="md">
      {items}
    </Accordion>
  );
}

export default CommunityListAccordion;
