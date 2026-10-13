import { z } from "zod";
import { DayOfWeek, Role, VerificationStatus } from "../../../generated/prisma/client";

const blockUserValidationSchema = z.object({
  body: z.object({
    userId: z.string({ message: "User ID is required" }),
    isBlocked: z.boolean({ message: "isBlocked boolean is required" }),
    banReason: z.string().optional(),
  }),
});

const verifyStudentValidationSchema = z.object({
  body: z.object({
    studentProfileId: z.string({ message: "Student Profile ID is required" }),
    status: z.nativeEnum(VerificationStatus, {
      message: "Verification status (VERIFIED or REJECTED) is required",
    }),
    rejectionReason: z.string().optional(),
    assignedTeacherId: z.string().optional(),
  }),
});

const assignTeacherValidationSchema = z.object({
  body: z.object({
    studentProfileId: z.string({ message: "Student Profile ID is required" }),
    teacherProfileId: z.string({ message: "Teacher Profile ID is required" }),
  }),
});

const createScheduleValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }),
    dayOfWeek: z.nativeEnum(DayOfWeek, { message: "Day of week is required" }),
    startTime: z.string({ message: "Start time is required" }),
    endTime: z.string({ message: "End time is required" }),
    meetingLink: z.string().optional(),
    teacherId: z.string({ message: "Teacher ID is required" }),
    studentId: z.string().optional(),
  }),
});

const updateUserRoleValidationSchema = z.object({
  body: z.object({
    userId: z.string({ message: "User ID is required" }),
    role: z.nativeEnum(Role, { message: "Role is required" }),
  }),
});

const createFieldValidationSchema = z.object({
  body: z.object({
    label: z.string({ message: "Field label is required" }).min(1, "Field label cannot be empty"),
    fieldName: z.string().optional(),
    targetRole: z.nativeEnum(Role, { message: "Target role must be STUDENT or TEACHER" }),
    fieldType: z.enum(["TEXT", "NUMBER", "DATE", "TEXTAREA", "SELECT"]).optional().default("TEXT"),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    required: z.boolean().optional().default(false),
    order: z.number().optional().default(0),
  }),
});

const updateFieldValidationSchema = z.object({
  body: z.object({
    label: z.string().min(1).optional(),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    required: z.boolean().optional(),
    order: z.number().optional(),
  }),
});

export const AdminValidations = {
  blockUserValidationSchema,
  verifyStudentValidationSchema,
  assignTeacherValidationSchema,
  createScheduleValidationSchema,
  updateUserRoleValidationSchema,
  createFieldValidationSchema,
  updateFieldValidationSchema,
};
