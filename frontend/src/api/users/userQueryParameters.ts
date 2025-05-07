import {PaginationProps} from "@/api";

export type UserQueryParams = PaginationProps & {
    community_id?: number;
    name?: string;
    is_staff?: boolean;
}