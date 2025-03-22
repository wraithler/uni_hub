import { useEffect, useState } from 'react';
import cx from 'clsx';
import { Container, Divider, Flex, Grid, Pagination, Text } from '@mantine/core';
import CommunityListAccordion from '@/components/CommunityList';
import { Layout } from '@/components/Layout';
import useCommunities from '@/hooks/useCommunities';
import classes from './Communities.module.css';

const PAGE_LIMIT = 10;

export function CommunitiesPage() {
  const [filters, setFilters] = useState<{
    name: string;
    category: string;
    limit: number;
    offset: number;
  }>({
    name: '',
    category: '',
    limit: PAGE_LIMIT,
    offset: 0,
  });

  const { communities, loading, error, fetchCommunities, paginationResponse } =
    useCommunities(filters);

  useEffect(() => {
    fetchCommunities();
  }, [filters, fetchCommunities]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * PAGE_LIMIT;

    if (newOffset === paginationResponse?.offset) {
      return;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      offset: newOffset,
    }));
  };

  // Calculate the current page from the offset if paginationResponse is available
  const currentPage = paginationResponse ? paginationResponse.offset / PAGE_LIMIT + 1 : 1;

  return (
    <Layout>
      <div>
        <Text size="xl" w={700}>
          Communities
        </Text>
        <Text size="sm" opacity={0.6}>
          Join communities to find people with similar interests
        </Text>
      </div>

      <Grid>
        <Grid.Col span="auto">
          {loading ? (
            <p>Loading</p>
          ) : (
            <Flex direction="column" gap="sm">
              <CommunityListAccordion communities={communities} />
              {paginationResponse && (
                <Pagination
                  total={Math.ceil(paginationResponse.count / PAGE_LIMIT)}
                  onChange={handlePageChange}
                  value={currentPage}
                />
              )}
            </Flex>
          )}
        </Grid.Col>
        <Divider orientation="vertical" />
        <Grid.Col span={4}>
          <Container className={cx(classes.item)}>
            <Text size="lg">Filters</Text>
          </Container>
        </Grid.Col>
      </Grid>
    </Layout>
  );
}
