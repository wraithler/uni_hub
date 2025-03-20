import {ReactNode} from "react";
import {HeaderTabs} from "@/components/Header/HeaderTabs";
import {Box} from "@mantine/core";
import {SearchBar} from "@/components/CustomSearchBar";

export function Layout({children}: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <HeaderTabs/>
            <Box
                mx={{xs: 4, sm: 8, md: "15%"}}
                my={{xs: 4, sm: 8, md: 10}}
                display="grid" style={{gap: "16px"}}
            >
                <SearchBar/>
                {children}
            </Box>
        </div>
    );
}