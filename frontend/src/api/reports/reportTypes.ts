import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes.ts";
import { Community } from "../communities/communityTypes";

type ReportCategory = {
  id: number;
  name: string;
};

type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED' | 'REJECTED';

type Report = {
  id?: number;
  title: string;
  description: string;
  category: number;
  evidence_links: any;
  status: ReportStatus;

  reported_by: User;
  reported_user: number;
  community: Community;

  reviewed_by: number;
  resolution_notes: string;

  created_at: string;
  updated_at: string;
};

type ReportList = PaginationResponse & {
  results: Report[];
};

type ReportAttachment = {
  id: number;
  file: string;
  description: string | null;
};

type ReportCreateInput = {
  title: string;
  description: string;
  category: number;
  reported_user?: User;
  community?: Community;
  evidence_links?: any | null;
};

type ReportUpdateInput = {
  title?: string;
  description?: string;
  evidence_links?: any;
};

type ReportResolveInput = {
  status: ReportStatus;
  resolution_notes?: string | null;
};

type ReportAttachmentInput = {
  report: number;
  file: File;
  description?: string | null;
};

export type { 
  ReportCategory, 
  ReportStatus, 
  Report, 
  ReportList, 
  ReportAttachment,
  ReportCreateInput,
  ReportUpdateInput,
  ReportResolveInput,
  ReportAttachmentInput
};