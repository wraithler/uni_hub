import {ReactNode} from "react";
import {HeaderTabs} from "@/components/Header/HeaderTabs";
import {Box} from "@mantine/core";
import {SearchBar} from "@/components/SearchBar";

export function Layout({children}: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderTabs/>
            <Box
                mx={{xs: 4, sm: 8, md: "15%"}}
                my={{xs: 4, sm: 8}}
                display="grid" style={{gap: "16px"}}
            >
                {/*<SearchBar*/}
                {/*    props={{placeholder: "Search for communities or users"}}*/}
                {/*    searchBarProps={{endpoint: "/api/communities/"}}*/}
                {/*/>*/}
                {children}
            </Box>
        </div>
    );
}