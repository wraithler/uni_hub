import {Accordion, Button, Checkbox, Flex, Grid, Group, Pagination, SimpleGrid} from '@mantine/core';
import {useCommunityList} from "@/hooks/useCommunityList";
import {CommunityListItem, CommunityFilters} from "@/types/communities";
import {useCommunityJoin} from "@/hooks/useCommunityJoin";

interface CommunityListAccordionProps {
    communities: CommunityListItem[];
}

function CommunityListAccordion({communities}: CommunityListAccordionProps) {
    const {handleJoinCommunity} = useCommunityJoin();

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
                            <Button size="sm" onClick={() => handleJoinCommunity(community)}>Join</Button>
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

function CommunityListFilters({filters, handleFilterChange}: CommunityListFiltersProps) {
    return (
        <Flex gap="md">
            <Checkbox
                label="Private"
                name="is_private"
                checked={filters.is_private}
                onChange={(e) => handleFilterChange(e.target.name, e.target.checked)}
            />
            <Checkbox
                label="Member"
                name="is_member"
                checked={filters.is_member}
                onChange={(e) => handleFilterChange(e.target.name, e.target.checked)}
            />
        </Flex>
    )
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
        handlePageChange
    } = useCommunityList();

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!communities) {
        return (<></>)
    }

    return (
        <SimpleGrid cols={{base: 1, xs: 2}}>
            <Grid gutter="md">
                <Grid.Col>
                    {communities.count === 0 && <div>No communities found</div>}
                    <CommunityListAccordion communities={communities.results}/>
                </Grid.Col>
                <Grid.Col>
                    <Flex justify="center">
                        <Pagination total={totalPages} value={currentPage} onChange={handlePageChange}/>
                    </Flex>
                </Grid.Col>
            </Grid>
            <CommunityListFilters filters={filters} handleFilterChange={handleFilterChange}/>
        </SimpleGrid>
    )
}

export default CommunityList;
