import {Paper, Title, Text, Button} from "@mantine/core";
import classes from './CarouselCard.module.css';

interface CardProps {
    image: string;
    title: string;
    category: string;
    props?: any;
}

export function Card({ image, title, category, props}: CardProps) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}
            className={classes.card}
            {...props}
            >
            <div>
                <Text className={classes.category} size="xs">
                    {category}
                </Text>
                <Title order={3} className={classes.title}>
                    {title}
                </Title>
            </div>
            <Button variant="white" color="dark">
                View
            </Button>
        </Paper>
    )
}