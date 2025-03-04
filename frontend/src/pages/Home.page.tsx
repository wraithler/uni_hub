import {HeaderTabs} from "@/components/Header/HeaderTabs";
import {HomeGrid} from "@/components/HomeGrid/HomeGrid";
import {Container, Text} from "@mantine/core";

export function HomePage() {
    return (
        <>
            <HeaderTabs/>
            {/*<Container size="md" my="xs">*/}
            {/*    <Text size="xl">Welcome back, Archie</Text>*/}
            {/*</Container>*/}
            <HomeGrid/>
        </>
    );
}
