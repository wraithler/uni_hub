import {Layout} from "@/components/Layout";
import {Container, Divider, Grid, Group, Stack, Text} from "@mantine/core";
import classes from './Communities.module.css';
import cx from "clsx";
import {Community} from "@/types";
import {useEffect, useState} from "react";
import api from "@/api";

function CommunityStackItem({name, emoji, description}: Community) {
    return (
        <Container className={cx(classes.item)}>
            <Group>
                <Text fz={20}>{emoji}</Text>
                <div>
                    <Text fz="sm" fw={500}>
                        {name}
                    </Text>
                    <Text fz="xs" opacity={0.6}>
                        {description}
                    </Text>
                </div>
            </Group>
        </Container>
    )
}

async function fetchData() {
    try {
        const response = await api.get(`/api/communities/`);
        return response.data.results;
    } catch (error) {
        return [];
    }
}

export function CommunitiesPage() {
    const [communities, setCommunities] = useState<Community[]>([]);

    useEffect(() => {
        fetchData().then((data) => {
            setCommunities(data);
        });
    }, []);

    return (
        <Layout>
            <div>
                <Text size="xl" w={700}>Communities</Text>
                <Text size="sm" opacity={0.6}>Join communities to find people with similar interests</Text>
            </div>

            <Grid>
                <Grid.Col span="auto">
                    <Stack>
                        {communities.map((community) => (
                            <CommunityStackItem key={community.id} {...community}/>
                        ))}
                    </Stack>
                </Grid.Col>
                <Divider orientation="vertical"/>
                <Grid.Col span={4}>
                    <Container className={cx(classes.item)}>
                        <Text size="lg">Filters</Text>
                    </Container>
                </Grid.Col>
            </Grid>
        </Layout>
    )
}