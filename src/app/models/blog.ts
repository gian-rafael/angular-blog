import { User } from "./user";

export type ApprovalStatus = "drafted" | "pending" | "approved" | "rejected";

export interface Blog {
  id: number;
  userId: number;
  title: string;
  content: string;
  imgContentUrl?: string;
  approvalStatus: ApprovalStatus;
  timestamp: Date;
}

export type BlogWithAuthor = Blog & { user: User };

// export type Draft = Omit<Post, "approvalStatus">;
