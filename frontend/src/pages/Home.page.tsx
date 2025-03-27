import { IconDots, IconHeart, IconMessageCircle } from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import { AspectRatio, Avatar, Badge, Card, Flex, Group, Image, Text } from '@mantine/core';
import { Layout } from '@/components/Layout';

const mockdata = {
  posts: [
    {
      title: 'Chess Tournament Finals',
      content:
        'Head whether for piece describe environmental. Cover sell reason back. Firm identify cost its feeling through model.',
      created_by_name: 'Erica Chan',
      community_name: 'Chess Community',
      created_by_profile_picture: 'https://picsum.photos/339/723',
      likes_count: 654,
      comments_count: 100,
    },
    {
      title: 'Include win.',
      content:
        'Culture mouth who enter return second hot. Over such society.\nOrganization laugh fall mission. Couple blue glass finish president. Age room so sit still arm.',
      created_by_name: 'Thomas Lee',
      community_name: 'Bank.',
      created_by_profile_picture: 'https://picsum.photos/200/748',
      likes_count: 747,
      comments_count: 195,
    },
    {
      title: 'Several seem suggest now matter.',
      content:
        'Believe outside include those free wall. Environment most sister miss word detail interest. Popular special resource subject wife agency science.',
      created_by_name: 'Jodi Silva',
      community_name: 'List manager.',
      created_by_profile_picture: 'https://picsum.photos/112/473',
      likes_count: 317,
      comments_count: 414,
    },
    {
      title: 'Machine question material.',
      content:
        'Thought power those model kitchen record themselves. Social subject between maybe kitchen. Church money approach peace. Off all lay last keep their figure experience.',
      created_by_name: 'Adam Roberts',
      community_name: 'Television before.',
      created_by_profile_picture: 'https://picsum.photos/112/847',
      likes_count: 282,
      comments_count: 304,
    },
    {
      title: 'Dog society music.',
      content:
        'Entire south open. Majority tax whether of.\nScientist fund adult capital assume meeting. Mr focus chair ready at.',
      created_by_name: 'Abigail Miller',
      community_name: 'Everything left fear.',
      created_by_profile_picture: 'https://dummyimage.com/690x177',
      likes_count: 459,
      comments_count: 649,
    },
    {
      title: 'Head performance significant candidate.',
      content:
        'Drug by simply gas beyond size. Public security personal enjoy measure ground staff suddenly.\nCatch safe manager letter.\nCity much among final act I window. Bank work evidence yet huge TV.',
      created_by_name: 'Erica Taylor',
      community_name: 'Thus meeting sit heart.',
      created_by_profile_picture: 'https://picsum.photos/32/440',
      likes_count: 431,
      comments_count: 22,
    },
    {
      title: 'Name laugh ball.',
      content:
        'Follow boy market medical rather they. Girl case sell near magazine. Common feel write wind.',
      created_by_name: 'Craig Jensen',
      community_name: 'Product bag.',
      created_by_profile_picture: 'https://dummyimage.com/223x218',
      likes_count: 223,
      comments_count: 304,
    },
    {
      title: 'On method around east.',
      content:
        'Get far describe form particular. Guy charge to evening six tonight.\nSeek effect suggest tell.\nSea age attack hope. Still board face property. Age hit stuff tough statement.',
      created_by_name: 'William Lam',
      community_name: 'Remember any.',
      created_by_profile_picture: 'https://picsum.photos/605/127',
      likes_count: 456,
      comments_count: 686,
    },
    {
      title: 'Buy stop room.',
      content:
        'Long now week fear perform. Affect grow idea rather wife wall.\nCharacter eye pay. Will performance country past. Wife resource bill total throughout.',
      created_by_name: 'Jason Torres',
      community_name: 'Experience water movie.',
      created_by_profile_picture: 'https://picsum.photos/890/921',
      likes_count: 527,
      comments_count: 251,
    },
    {
      title: 'Well customer green body.',
      content:
        'Party nothing central. Think his moment mouth eat you. Agreement he may investment generation analysis.\nOption station discuss score center work. Understand large should gun different practice type.',
      created_by_name: 'Lindsey Meadows',
      community_name: 'Address fill manager.',
      created_by_profile_picture: 'https://dummyimage.com/2x474',
      likes_count: 662,
      comments_count: 363,
    },
  ],
  events: [
    {
      id: 1,
      title: 'True green imagine.',
      description:
        'Stage under show specific herself series. Likely trade matter may fly thought. Director measure statement follow serve hundred sea.',
      event_date: '1984-11-29T07:44:30.164552Z',
      location: '708 Henry Summit\nJameschester, VT 73389',
      created_at: '2025-03-15T21:33:51.481288Z',
      updated_at: '2025-03-15T21:33:51.481291Z',
      virtual_event: false,
      virtual_link: null,
      created_by: 8067,
      community: 1,
    },
    {
      id: 2,
      title: 'Task yes space seem.',
      description:
        'Beyond process own skin two degree. Environmental some word off president example. Million provide anyone yet me not wrong long.',
      event_date: '1981-07-28T11:36:07.768115Z',
      location: '25419 Cook Way\nEast Stephaniemouth, TX 11354',
      created_at: '2025-03-15T21:33:51.482884Z',
      updated_at: '2025-03-15T21:33:51.482887Z',
      virtual_event: true,
      virtual_link: '<factory.faker.Faker object at 0xffffa7dfe8a0>',
      created_by: 8068,
      community: 1,
    },
    {
      id: 3,
      title: 'Information anyone actually.',
      description:
        'Deep window dream onto. Seven throw husband hold option special. Young suggest outside student realize.',
      event_date: '1976-12-20T17:57:41.895229Z',
      location: '826 Phelps Lodge\nPattersontown, WI 44817',
      created_at: '2025-03-15T21:33:51.483984Z',
      updated_at: '2025-03-15T21:33:51.483987Z',
      virtual_event: true,
      virtual_link: '<factory.faker.Faker object at 0xffffa7e1b470>',
      created_by: 8069,
      community: 1,
    },
    {
      id: 4,
      title: 'Apply choose organization smile.',
      description:
        'Various store service hospital place peace whom. Live against occur tonight television former. Company time always energy.',
      event_date: '1991-01-02T01:01:49.403652Z',
      location: '302 Andrew Stravenue Apt. 620\nNew Stephaniechester, IN 14880',
      created_at: '2025-03-15T21:33:51.485100Z',
      updated_at: '2025-03-15T21:33:51.485103Z',
      virtual_event: true,
      virtual_link: '<factory.faker.Faker object at 0xffffa7e1bfb0>',
      created_by: 8070,
      community: 1,
    },
    {
      id: 5,
      title: 'Evidence various worker price.',
      description:
        'Significant indicate up skin school himself. Animal lawyer success young more. Myself dream cost lose carry across.',
      event_date: '1992-08-09T12:52:07.064802Z',
      location: '601 Sparks Views Apt. 118\nLake Danielport, HI 13953',
      created_at: '2025-03-15T21:33:51.486175Z',
      updated_at: '2025-03-15T21:33:51.486178Z',
      virtual_event: false,
      virtual_link: null,
      created_by: 8071,
      community: 1,
    },
  ],
};

export function HomePage() {
  const posts = mockdata.posts;
  const events = mockdata.events;

  return (
    <Layout>
      <Flex w={700} direction="column" gap="md">
        {posts.map((post, index) => (
          <Card withBorder radius="md" p="md">
            <Card.Section p="sm">
              <Group justify="space-between">
                <Flex direction="column">
                  <Text size="xs" opacity={0.6}>
                    {post.community_name.toUpperCase()}
                  </Text>
                  <Text size="lg">{post.title}</Text>
                </Flex>
                <IconDots />
              </Group>
            </Card.Section>

            {index % 2 === 0 && (
              <Card.Section>
                <AspectRatio ratio={16 / 9}>
                  <Carousel withControls withIndicators>
                    <Carousel.Slide>
                      <Image
                        src="https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fHww"
                        alt="Norway"
                      />
                    </Carousel.Slide>
                    <Carousel.Slide>
                      <Image
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                        alt="Norway"
                        fit="cover"
                      />
                    </Carousel.Slide>
                  </Carousel>
                </AspectRatio>
              </Card.Section>
            )}

            <Card.Section p="sm">
              <Group justify="apart">
                <Group gap="sm">
                  <Avatar
                    src={post.created_by_profile_picture}
                    alt={post.created_by_name}
                    radius="xl"
                    size={20}
                  />
                  <Text size="sm" opacity={0.6}>
                    {post.created_by_name}
                  </Text>
                </Group>

                <Group gap="sm">
                  <IconHeart size={20} />
                  <Text size="sm" opacity={0.6}>
                    {post.likes_count} Likes
                  </Text>
                </Group>

                <Group gap="sm">
                  <IconMessageCircle size={20} />
                  <Text size="sm" opacity={0.6}>
                    {post.comments_count} Comments
                  </Text>
                </Group>
              </Group>
            </Card.Section>

            <Card.Section p="sm">
              <Text>{post.content}</Text>
            </Card.Section>
          </Card>
        ))}
      </Flex>
    </Layout>
  );
}
