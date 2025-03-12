import {Grid, px, SimpleGrid, Skeleton, useMantineTheme} from '@mantine/core';

const BASE_HEIGHT = 550;
const getSubHeight = (children: number, spacing: number) =>
    BASE_HEIGHT / children - spacing * ((children - 1) / children);
const getChild = (height: number) => <Skeleton height={height} radius="md" animate={false}/>;

export function HomeGrid() {
    const theme = useMantineTheme();

    return (
        <SimpleGrid cols={{base: 1, xs: 2}}>
            <Grid gutter="md">
                <Grid.Col>{getChild(getSubHeight(2, px(theme.spacing.md) as number))}</Grid.Col>
                <Grid.Col>{getChild(getSubHeight(2, px(theme.spacing.md) as number))}</Grid.Col>
            </Grid>
            {getChild(getSubHeight(1, px(theme.spacing.md) as number))}
        </SimpleGrid>
    );
}
