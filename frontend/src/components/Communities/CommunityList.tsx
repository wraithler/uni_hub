import { Flex, Grid, Pagination } from '@mantine/core';
import { useCommunityList } from '@/hooks/useCommunityList';
import CommunityListAccordion from "@/components/Communities/CommunityListAccordion";
import CommunityListFilters from "@/components/Communities/CommunityListFilters";

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
