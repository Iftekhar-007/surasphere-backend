import { Role, UserStatus, VerificationStatus, TaskStatus, DayOfWeek } from "../../generated/prisma/client";

export { Role, UserStatus, VerificationStatus, TaskStatus, DayOfWeek };

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  rollNumber?: string | null;
  role: Role;
  status: UserStatus;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  user: IAuthUser;
}

export interface IApiResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
}
