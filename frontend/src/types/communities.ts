import api from '@/api';
import Filters, { PaginationFilters } from '@/types/filters';
import { PaginationResponse } from '@/types/pagination';

type CommunityCategoryDetail = {
  id: number;
  name: string;
  description: string;
};

type CommunityCategoryListItem = {
  id: number;
  name: string;
};

type CommunityCategoryList = PaginationResponse & {
  results: CommunityCategoryListItem[];
};

type CommunityDetail = {
  id: number;
  name: string;
  description: string;
  emoji: string;
};

type CommunityListItem = {
  id: number;
  name: string;
  description: string;
  emoji: string;
  is_private: boolean;
  member_count: number;
};

type CommunityList = PaginationResponse & {
  results: CommunityListItem[];
};

type CommunitySortBy =
  | '-name'
  | 'name'
  | '-created_at'
  | 'created_at'
  | '-updated_at'
  | 'updated_at'
  | 'popularity'
  | '-popularity';
type CommunityVisibility = 'all' | 'public' | 'private';
type CommunityMembershipStatus = 'member' | 'all' | 'not_member';

type CommunityFilters = PaginationFilters & {
  name?: string;
  visibility?: CommunityVisibility;
  sort_by?: CommunitySortBy;
  membership_status?: CommunityMembershipStatus;
};

const fetchCommunityDetail = async (id: number): Promise<CommunityDetail> => {
  return await api.get(`/communities/${id}/`);
};

const fetchCommunityList = async (filters: Filters): Promise<{ data: CommunityList }> => {
  const res = await api.get(`/communities/`, { params: filters });
  return { data: res.data };
};

const createCommunity = async (community: Partial<CommunityDetail>): Promise<CommunityDetail> => {
  return await api.post(`/communities/create/`, community);
};

const updateCommunity = async (community: Partial<CommunityDetail>): Promise<CommunityDetail> => {
  return await api.put(`/communities/${community.id}/update/`, community);
};

const joinCommunity = async (community: Partial<CommunityDetail>): Promise<CommunityDetail> => {
  return await api.post(`/communities/${community.id}/join/`, community);
};

export {
  fetchCommunityDetail,
  fetchCommunityList,
  createCommunity,
  updateCommunity,
  joinCommunity,
};

export type {
  CommunityDetail,
  CommunityListItem,
  CommunityList,
  CommunityFilters,
  CommunitySortBy,
  CommunityVisibility,
  CommunityMembershipStatus,
  CommunityCategoryDetail,
  CommunityCategoryListItem,
  CommunityCategoryList,
};
