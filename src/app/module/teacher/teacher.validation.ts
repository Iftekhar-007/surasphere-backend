import { z } from "zod";

const updateTeacherProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    qualifications: z.string().optional(),
    experienceYears: z.coerce.number().optional(),
    specialization: z.string().optional(),
    maxStudents: z.coerce.number().optional(),
  }),
});

const createHomeTaskValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string({ message: "Description is required" }),
    surahName: z.string().optional(),
    startAyah: z.coerce.number().optional(),
    endAyah: z.coerce.number().optional(),
    dueDate: z.string().optional(),
    studentIds: z.array(z.string()).min(1, "Select at least one student"),
  }),
});

const giveDailyFeedbackValidationSchema = z.object({
  body: z.object({
    studentId: z.string({ message: "Student ID is required" }),
    performanceRating: z.coerce.number().min(1).max(10),
    feedbackComment: z.string().min(1, "Feedback comment is required"),
    mistakesNotes: z.string().optional(),
    nextDayLesson: z.string().min(1, "Next day lesson plan is required"),
  }),
});

const recordDailyProgressValidationSchema = z.object({
  body: z.object({
    studentId: z.string({ message: "Student ID is required" }),
    sabqSurah: z.string().optional(),
    sabqAyahRange: z.string().optional(),
    sabqiSurah: z.string().optional(),
    manzilJuz: z.coerce.number().optional(),
    memorizationScore: z.coerce.number().min(1).max(10).optional(),
    tajweedScore: z.coerce.number().min(1).max(10).optional(),
    notes: z.string().optional(),
  }),
});

export const TeacherValidations = {
  updateTeacherProfileValidationSchema,
  createHomeTaskValidationSchema,
  giveDailyFeedbackValidationSchema,
  recordDailyProgressValidationSchema,
};
