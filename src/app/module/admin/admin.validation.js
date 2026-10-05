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
export const AdminValidations = {
    blockUserValidationSchema,
    verifyStudentValidationSchema,
    assignTeacherValidationSchema,
    createScheduleValidationSchema,
    updateUserRoleValidationSchema,
};
