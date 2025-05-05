import {PaginationProps} from "@/api";

export type UserQueryParams = PaginationProps & {
    community_id: number;
}