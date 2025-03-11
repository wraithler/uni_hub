import { useState } from 'react';
import {
  IconChevronDown,
  IconEye,
  IconHeart,
  IconLogout,
  IconMessage,
  IconSettings,
  IconStar,
} from '@tabler/icons-react';
import cx from 'clsx';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Burger,
  Container,
  Group,
  Image,
  Menu,
  MenuItem,
  Tabs,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import logo from '@/assets/images/logo.png';
import classes from './HeaderTabs.module.css';

const user = {
  name: 'Test User',
  email: 'testuser@email.com',
  image: '',
};

const tabs = ['Home', 'Communities', 'Events', 'Support'];

export function HeaderTabs() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const navigate = useNavigate();

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab}>
      {tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <Group gap="xs">
            <Image style={{ height: 28 }} src={logo} />
            <Text size="lg" fw={700}>
              Uni Hub
            </Text>
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {user.name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Quick Access</Menu.Label>
              <Menu.Item
                leftSection={<IconHeart size={16} color={theme.colors.red[6]} stroke={1.5} />}
              >
                Liked posts
              </Menu.Item>
              <Menu.Item
                leftSection={<IconStar size={16} color={theme.colors.yellow[6]} stroke={1.5} />}
              >
                Saved posts
              </Menu.Item>
              <Menu.Item
                leftSection={<IconMessage size={16} color={theme.colors.blue[6]} stroke={1.5} />}
              >
                Your comments
              </Menu.Item>

              <Menu.Label>Settings</Menu.Label>
              <MenuItem
                onClick={() =>
                  setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                leftSection={<IconEye size={16} stroke={1.5} />}
              >
                Use {colorScheme === 'light' ? 'dark' : 'light'} theme
              </MenuItem>
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
                Account settings
              </Menu.Item>
              {/*<Menu.Item leftSection={<IconSwitchHorizontal size={16} stroke={1.5}/>}>*/}
              {/*    Change account*/}
              {/*</Menu.Item>*/}
              <Menu.Divider />

              <Menu.Item
                onClick={() => navigate('/logout')}
                leftSection={<IconLogout size={16} stroke={1.5} />}
              >
                Logout
              </Menu.Item>

              {/*<Menu.Label>Danger zone</Menu.Label>*/}
              {/*<Menu.Item color="red" leftSection={<IconTrash size={16} stroke={1.5}/>}>*/}
              {/*    Delete account*/}
              {/*</Menu.Item>*/}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
    </div>
  );
}
