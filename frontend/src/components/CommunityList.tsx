import {Community} from "@/types";
import {Accordion, Button, Flex, Group} from "@mantine/core";

interface CommunityListAccordionProps {
    communities: Community[];
}

function CommunityListAccordion({communities}: CommunityListAccordionProps) {
    const items = communities.map((community) => (
        <Accordion.Item key={community.id} value={community.name}>
            <Accordion.Control icon={community.emoji}>{community.name}</Accordion.Control>
            <Accordion.Panel>
                <Flex direction="column" gap="md">
                    {community.description}
                    <Group gap="sm" justify="flex-end">
                        <Button size="sm" variant="light">View page</Button>
                        {community.is_private ?
                            <Button size="sm">Request to join</Button> :
                            <Button size="sm">Join</Button>
                        }
                    </Group>
                </Flex>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <Accordion variant="contained" radius="md">
            {items}
        </Accordion>
    )
}

export default CommunityListAccordion;