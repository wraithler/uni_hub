import {Group, Text, useCombobox, Combobox, InputBase, Loader} from "@mantine/core";
import {useCallback, useEffect, useState} from "react";
import {debounce} from "@/utils";
import api from "@/api";
import {IconSearch} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";

interface SelectOptionProps {
    id: number;
    emoji: string;
    name: string;
    description: string;
}

function SelectOption({emoji, name, description}: SelectOptionProps) {
    return (
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
    );
}

async function fetchData(query: string) {
    try {
        const response = await api.get(`/api/communities/?search=${query}`);
        return response.data.results;
    } catch (error) {
        return [];
    }
}

export function CommunitySearchBar() {
    const [value, setValue] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SelectOptionProps[]>([]);
    const navigate = useNavigate();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const debouncedQueryUpdate = useCallback(debounce(setDebouncedQuery, 500), []);

    useEffect(() => {
        debouncedQueryUpdate(value);
    }, [value]);

    useEffect(() => {
        if (!debouncedQuery || debouncedQuery === '') {
            setData([]);
            return;
        }

        setLoading(true);
        fetchData(debouncedQuery).then((response) => {
            setData(response);
            setLoading(false);
            combobox.resetSelectedOption();
        });
    }, [debouncedQuery]);

    const options = data.map((item) => (
        <Combobox.Option value={item.name} key={item.name}>
            <SelectOption {...item} />
        </Combobox.Option>
    ));

    const navigateToOption = (val: string) => {
        const option = data.find((item) => item.name === val);
        if (option) {
            navigate(`/communities/${option.id}`);
        }
    }

    return (
        <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => navigateToOption(val)}
        >
            <Combobox.Target>
                <InputBase
                    component="input"
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    placeholder="Search for a community..."
                    leftSection={<IconSearch size={18} stroke={1.5}/>}
                    rightSection={loading ? <Loader size={18}/> : <></>}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                    radius="xl"
                    size="md"
                    rightSectionWidth={42}
                />
            </Combobox.Target>
            <Combobox.Dropdown>
                <Combobox.Options>
                    {loading ? <></> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}