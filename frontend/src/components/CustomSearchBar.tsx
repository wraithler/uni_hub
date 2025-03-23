import { useCallback, useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Combobox, Divider, Group, InputBase, Loader, Text, useCombobox } from '@mantine/core';
import api from '@/api';
import { Community, User } from '@/types';
import { debounce } from '@/utils';

interface SelectOptionProps {
  id: number;
  emoji?: string;
  name: string;
  description?: string;
  type: string;
  profile_picture?: string;
  bio?: string;
}

function SelectOption({ emoji, name, description, type, profile_picture, bio }: SelectOptionProps) {
  return type === 'communities' ? (
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
  ) : (
    <Group>
      <img
        src={`http://localhost:3001/${profile_picture}`}
        alt={name}
        width={32}
        height={32}
        style={{ borderRadius: '50%' }}
      />
      <div>
        <Text fz="sm" fw={500}>
          {name}
        </Text>
        <Text fz="xs" opacity={0.6}>
          {bio}
        </Text>
      </div>
    </Group>
  );
}

interface SearchBarData {
  communities: Community[];
  users: User[];
}

async function fetchData(query: string) {
  try {
    const response = await api.get(`/api/search/?search=${query}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

export function SearchBar() {
  const INPUT_PLACEHOLDER = 'Search for something...';
  const [value, setValue] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchBarData | null>(null);

  const navigate = useNavigate();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const updateDebouncedQuery = useCallback(debounce(setDebouncedQuery, 500), []);

  useEffect(() => {
    updateDebouncedQuery(value);
  }, [value]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery === '') {
      setData(null);
      return;
    }
    setLoading(true);
    fetchData(debouncedQuery).then((response) => {
      setData(response);
      setLoading(false);
      combobox.resetSelectedOption();
    });
  }, [debouncedQuery]);

  const navigateToRoute = (val: string) => {
    const community = data?.communities.find((community) => community.name === val);
    const user = data?.users.find((user) => user.name === val);

    if (community) {
      navigate(`/communities/${community.id}`);
    } else if (user) {
      navigate(`/users/${user.id}`);
    }
  };

  return (
    <Combobox store={combobox} withinPortal={false} onOptionSubmit={navigateToRoute}>
      {/* Search Input */}
      <Combobox.Target>
        <InputBase
          component="input"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          placeholder={INPUT_PLACEHOLDER}
          leftSection={<IconSearch size={18} stroke={1.5} />}
          rightSection={loading ? <Loader size={18} /> : null}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          radius="xl"
          size="md"
          rightSectionWidth={42}
        />
      </Combobox.Target>

      {/* Dropdown Options */}
      <Combobox.Dropdown>
        <Combobox.Options>
          {/* Users Section */}
          {loading ? null : (
            <>
              {/* Users Section */}
              {(data?.users?.length ?? 0) > 0 && (
                <>
                  <Divider label="Users" labelPosition="left" />
                  {data?.users?.map((user) => (
                    <Combobox.Option value={user.name} key={`user-${user.name}`}>
                      <SelectOption {...user} type="users" />
                    </Combobox.Option>
                  ))}
                </>
              )}

              {/* Communities Section */}
              {(data?.communities?.length ?? 0) > 0 && (
                <>
                  <Divider label="Communities" labelPosition="left" />
                  {data?.communities?.map((community) => (
                    <Combobox.Option value={community.name} key={`community-${community.name}`}>
                      <SelectOption {...community} type="communities" />
                    </Combobox.Option>
                  ))}
                </>
              )}
            </>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
