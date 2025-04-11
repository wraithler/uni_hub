import { AxiosResponse } from "axios";
import api from "@/api/old/api.ts";
import {CommunityFilters, CommunityList} from "@/api/old/types/communities.tsx";

export const fetchCommunitiesList = async (filters: CommunityFilters): Promise<AxiosResponse<CommunityList>> => {
  return await api.get("/communities/", { params: filters });
};

