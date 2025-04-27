import { PaginationResponse } from "@/api";
import { User } from "@/api/users/userTypes";
import { Community } from "@/api/communities/communityTypes";

type ReportStatus = 
  | "PENDING" 
  | "UNDER_REVIEW" 
  | "RESOLVED" 
  | "CLOSED" 
  | "REJECTED";

type ReportCategory = {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
};

type ReportAttachment = {
  id: number;
  report: number;
  file: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

type Report = {
  id: number;
  reported_by: User;
  reported_user?: User;
  community?: Community;
  category: ReportCategory;
  title: string;
  description: string;
  evidence_links?: string[];
  status: ReportStatus;
  reviewed_by?: User;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
  attachments?: ReportAttachment[];
};

type ReportList = PaginationResponse & {
  results: Report[];
};

type ReportResolveInput = {
  status: ReportStatus;
  resolution_notes?: string;
};

type ReportAttachmentUploadInput = {
  file: File;
  description?: string;
};

type CreateReportInput = {
  title: string;
  description: string;
  category: number;
  reported_user?: number;
  community?: number;
  evidence_links?: string[];
};

type UpdateReportInput = {
  title?: string;
  description?: string;
  category?: number;
  evidence_links?: string[];
};

type MutationContext = {
  previousReport: Report | undefined;
};

export type {
  ReportStatus,
  Report,
  ReportList,
  ReportCategory,
  ReportAttachment,
  ReportResolveInput,
  ReportAttachmentUploadInput,
  CreateReportInput,
  UpdateReportInput,
  MutationContext
};