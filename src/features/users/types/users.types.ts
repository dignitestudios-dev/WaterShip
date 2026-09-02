import { User, Pagination, ApiResponse } from "@/features/auth";

export interface CompleteProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  primaryAddress?: string;
  profilePicture?: File | Blob;
}

export interface UpdateProfilePayload extends CompleteProfilePayload {}

export interface UsersListResponse {
  users: User[];
  pagination: Pagination;
}
