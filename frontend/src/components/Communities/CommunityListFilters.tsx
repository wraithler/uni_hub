import {CommunityFilters} from "@/types/communities";
import {Card, Flex, Select} from "@mantine/core";

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

export default CommunityListFilters;