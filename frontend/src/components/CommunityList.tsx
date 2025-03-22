import { useEffect, useState } from 'react';
import { Accordion, Button, Flex, Group, Pagination } from '@mantine/core';
import useCommunities from '@/hooks/useCommunities';
import { Community, CommunityFilters } from '@/types';

interface CommunityListAccordionProps {
  communities: Community[];
}

function CommunityListAccordion({ communities }: CommunityListAccordionProps) {
  const items = communities.map((community) => (
    <Accordion.Item key={community.id} value={community.name}>
      <Accordion.Control icon={community.emoji}>{community.name}</Accordion.Control>
      <Accordion.Panel>
        <Flex direction="column" gap="md">
          {community.description}
          <Group gap="sm" justify="flex-end">
            <Button size="sm" variant="light">
              View page
            </Button>
            {community.is_private ? (
              <Button size="sm">Request to join</Button>
            ) : (
              <Button size="sm">Join</Button>
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

function CommunityList() {
  const [filters, setFilters] = useState<CommunityFilters>({
    name: '',
    category: '',
    limit: 10,
    offset: 0,
  });
  const { communities, loading, error, fetchCommunities, paginationResponse } =
    useCommunities(filters);

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * (filters.limit ?? 10);

    if (newOffset === paginationResponse?.offset) {
      return;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      offset: newOffset,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const currentPage = paginationResponse
    ? paginationResponse.offset / (filters.limit ?? 10) + 1
    : 1;

  useEffect(() => {
    fetchCommunities();
  }, [filters, fetchCommunities]);

  return (
    <Flex direction="column" gap="md">
      <CommunityListAccordion communities={communities} />
      {paginationResponse && (
        <Pagination
          total={Math.ceil(paginationResponse.count / (filters.limit ?? 10))}
          onChange={handlePageChange}
          value={currentPage}
        />
      )}
    </Flex>
  );
}

export default CommunityListAccordion;
