import {Community} from "@/api/communities/communityTypes.ts";

type Post = {
    id?: number;
    content: string;
    community?: Community | number;

    // TODO: Add likes/comments
    // created_by:
}

export type { Post };