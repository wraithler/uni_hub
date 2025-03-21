import {Community, PaginationResponse} from "@/types";
import {useCallback, useEffect, useState} from "react";
import api from "@/api";
import {buildQueryParams, Filters} from "@/utils";

const BASE_URL = "/communities";
const BASE_LIMIT = 10;

const useCommunities = (filters: Filters = {}): {
    communities: Community[];
    communityDetail: Community | null;
    loading: boolean;
    error: Error | null;
    fetchCommunities: () => void;
    createCommunity: (data: object) => void;
    fetchCommunityDetail: (communityId: number) => void;
    updateCommunity: (communityId: number, data: object) => void;
    paginationResponse: PaginationResponse | null;
} => {
    const [paginationResponse, setPaginationResponse] = useState<PaginationResponse | null>(null);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [communityDetail, setCommunityDetail] = useState<Community | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCommunities = useCallback(async () => {
        setLoading(true);

        try {
            const queryParams = buildQueryParams(filters);
            const url = queryParams ? `${BASE_URL}/?${queryParams}` : `${BASE_URL}`;
            const response = await api.get(url);
            setPaginationResponse(response.data);
            setCommunities(response.data.results);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const createCommunity = async (data: object) => {
        setLoading(true);

        try {
            await api.post(`${BASE_URL}/create/`, data);
            await fetchCommunities();
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommunityDetail = async (communityId: number) => {
        setLoading(true);

        try {
            const response = await api.get(`${BASE_URL}/${communityId}/`)
            setCommunityDetail(response.data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    const updateCommunity = async (communityId: number, data: object) => {
        setLoading(true);

        try {
            // TODO: Potentially use PUT instead of POST?
            await api.post(`${BASE_URL}/${communityId}/update/`, data);
            await fetchCommunityDetail(communityId);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCommunities();  // noqa
    }, [fetchCommunities]);

    return {
        communities,
        communityDetail,
        loading,
        error,
        fetchCommunities,
        createCommunity,
        fetchCommunityDetail,
        updateCommunity,
        paginationResponse,
    };
};

export default useCommunities;