import { Accordion, Button, Card, Flex, Grid, Group, Pagination, Select } from '@mantine/core';
import { useCommunityJoin } from '@/hooks/useCommunityJoin';
import { useCommunityList } from '@/hooks/useCommunityList';
import { CommunityFilters, CommunityListItem } from '@/types/communities';

interface CommunityListAccordionProps {
  communities: CommunityListItem[];
}

function CommunityListAccordion({ communities }: CommunityListAccordionProps) {
  const { handleJoinCommunity } = useCommunityJoin();

  const items = communities.map((community) => (
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
  ));

  return (
    <Accordion variant="contained" radius="md">
      {items}
    </Accordion>
  );
}

interface CommunityListFiltersProps {
  filters: CommunityFilters;
  handleFilterChange: (name: string, value: boolean | string) => void;
}

function CommunityListFilters({ filters, handleFilterChange }: CommunityListFiltersProps) {
  return (
    <Card withBorder radius="md">
      <Flex gap="sm" direction="column">
        <Select
          checkIconPosition="left"
          data={[
            { value: 'all', label: 'All' },
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]}
          label="Visibility"
          placeholder="Select visibility"
          value={filters.visibility}
          onChange={(value) => handleFilterChange('visibility', value ?? 'all')}
        />

        <Select
          checkIconPosition="left"
          data={[
            { value: 'name', label: 'Name (A-Z)' },
            { value: '-name', label: 'Name (Z-A)' },
            { value: '-created_at', label: 'Newest' }, // TODO: Check if the -created_at is correct sorting
            { value: 'created_at', label: 'Oldest' },
            { value: 'popularity', label: 'Popularity (Most members)' },
            { value: '-popularity', label: 'Popularity (Least members)' },
          ]}
          label="Sort by"
          placeholder="Sort by"
          value={filters.sort_by}
          onChange={(value) => handleFilterChange('sort_by', value ?? 'name')}
        />

        <Select
          checkIconPosition="left"
          data={[
            { value: 'all', label: 'All' },
            { value: 'member', label: 'Member' },
            { value: 'not_member', label: 'Not a member' },
          ]}
          label="Membership status"
          placeholder="Select membership status"
          value={filters.membership_status}
          onChange={(value) => handleFilterChange('membership_status', value ?? 'all')}
        />
      </Flex>
    </Card>
  );
}

function CommunityList() {
  const {
    data: communities,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    handleFilterChange,
    handlePageChange,
  } = useCommunityList();

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!communities) {
    return <></>;
  }

  return (
    <Grid gutter="md">
      <Grid.Col span={8}>
        <Flex gap="sm" direction="column">
          {communities.count === 0 && <div>No communities found</div>}
          <CommunityListAccordion communities={communities.results} />
          <Flex justify="center">
            <Pagination total={totalPages} value={currentPage} onChange={handlePageChange} />
          </Flex>
        </Flex>
      </Grid.Col>
      <Grid.Col span={4}>
        <CommunityListFilters filters={filters} handleFilterChange={handleFilterChange} />
      </Grid.Col>
    </Grid>
  );
}

export default CommunityList;
