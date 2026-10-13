import { DayOfWeek, Role, UserStatus, VerificationStatus } from "../../../generated/prisma/client";

export interface IBlockUserPayload {
  userId: string;
  isBlocked: boolean;
  banReason?: string;
}

export interface IVerifyStudentPayload {
  studentProfileId: string;
  status: VerificationStatus; // VERIFIED or REJECTED
  rejectionReason?: string;
  assignedTeacherId?: string;
}

export interface IAssignTeacherPayload {
  studentProfileId: string;
  teacherProfileId: string;
}

export interface ICreateSchedulePayload {
  title: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  teacherId: string;
  studentId?: string;
}

export interface IUpdateUserRolePayload {
  userId: string;
  role: Role;
}

export interface ICreateFieldPayload {
  label: string;
  fieldName?: string;
  targetRole: Role;
  fieldType?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  order?: number;
}

export interface IUpdateFieldPayload {
  label?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  order?: number;
}
