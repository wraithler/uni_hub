import {IconArrowRight, IconSearch} from '@tabler/icons-react';
import {ActionIcon, Autocomplete, AutocompleteProps, useMantineTheme} from '@mantine/core';
import {useCallback, useState} from "react";
import {debounce} from "@/utils";
import api from "@/api";

interface SearchBarProps {
    endpoint: string;
    autocomplete?: boolean;
}

export function SearchBar({props, searchBarProps}: {props: AutocompleteProps, searchBarProps: SearchBarProps}) {
    const theme = useMantineTheme();
    const [data, setData] = useState([]);

    const fetchResults = async (query: string) => {
        if (query === "") {
            setData([]);
            return;
        }

        const response = await api.get(`${searchBarProps.endpoint}?search=${query}`);

        setData(response.data.results.map((result: any) => ({label: `${result.name} (${result.category.name})`, value: result.name})));
    }

    const debouncedFetchResults = useCallback(debounce(fetchResults, 300), []);

    return (
        <Autocomplete
            leftSection={<IconSearch size={18} stroke={1.5}/>}
            rightSection={
                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                    <IconArrowRight size={18} stroke={1.5}/>
                </ActionIcon>
            }
            {...props}
            data={data}
            onChange={debouncedFetchResults}
            radius="xl"
            size="md"
            rightSectionWidth={42}
            />

        // <TextInput
        //     radius="xl"
        //     size="md"
        //     rightSectionWidth={42}
        //     leftSection={<IconSearch size={18} stroke={1.5}/>}
        //     rightSection={
        //         <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
        //             <IconArrowRight size={18} stroke={1.5}/>
        //         </ActionIcon>
        //     }
        //     {...props}
        // />
    );
}