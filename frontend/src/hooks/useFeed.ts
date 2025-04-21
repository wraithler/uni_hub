import {useInfiniteQuery} from "@tanstack/react-query";
import api from "@/api/old/api.ts";

import {PaginationResponse} from "@/api";

export type FeedItem = {
    id: number;
    type: "post" | "event";
    title: string;
    created_by: {
        id: number;
        first_name: string;
        last_name: string;
    };
    community: {
        id: number;
        name: string;
    };
    timestamp: string;
    // Optionals (event only):
    description?: string;
    attendees?: number;
    location?: string;
    // Optionals (post only):
    content?: string;
    likes?: number;
    comments?: number;
}

export type FeedFilters = {
    display: "all" | "posts" | "events";
}

type Feed = PaginationResponse & {
    results: FeedItem[];
}

const fetchFeed = async ({pageParam = 1}) => {
    const offset = (pageParam - 1) * 10;
    const response = await api.get("/feed/", {
        params: {limit: 10, offset: offset},
    });
    return response.data as Feed;
}

export const useFeed = () => {
    return useInfiniteQuery({
        queryKey: ["feed"],
        queryFn: fetchFeed,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.results.length > 0 ? allPages.length + 1 : undefined;
        },

    })
};