import {useEffect, useState} from "react";
import {CommunityDetail, fetchCommunityDetail} from "@/types/communities";

export function useCommunityDetail(id: number) {
    const [data, setData] = useState<CommunityDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchCommunityDetail(id);
                setData(res);
                setError(null);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    return {
        data,
        loading,
        error,
    }
}