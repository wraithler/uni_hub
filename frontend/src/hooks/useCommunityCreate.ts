import {CommunityDetail, createCommunity } from "@/types/communities";
import {useState} from "react";

export function useCommunityCreate() {
    const [data, setData] = useState<CommunityDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const handleCreateCommunity = async (community: Partial<CommunityDetail>) => {
        setLoading(true);
        try {
            const res = await createCommunity(community);
            setData(res);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, handleCreateCommunity };
}