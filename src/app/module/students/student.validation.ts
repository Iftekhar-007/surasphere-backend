import { z } from "zod";

const createStudentProfileValidationSchema = z.object({
  body: z.object({
    age: z.coerce.number().optional(),
    gender: z.string().optional(),
    phone: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    address: z.string().optional(),
    currentJuz: z.coerce.number().min(1).max(30).optional(),
    currentSurah: z.string().optional(),
    currentAyah: z.coerce.number().optional(),
    targetSurah: z.string().optional(),
    learningLevel: z.string().optional(),
  }),
});

const updateStudentProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.coerce.number().optional(),
    gender: z.string().optional(),
    phone: z.string().optional(),
    guardianName: z.string().optional(),
    guardianPhone: z.string().optional(),
    address: z.string().optional(),
    currentJuz: z.coerce.number().min(1).max(30).optional(),
    currentSurah: z.string().optional(),
    currentAyah: z.coerce.number().optional(),
    targetSurah: z.string().optional(),
    learningLevel: z.string().optional(),
  }),
});

const submitTaskValidationSchema = z.object({
  body: z.object({
    submissionNote: z.string().optional(),
  }),
});

const teacherReviewValidationSchema = z.object({
  body: z.object({
    teacherId: z.string({ message: "Teacher ID is required" }),
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().min(1, "Comment is required"),
  }),
});

export const StudentValidations = {
  createStudentProfileValidationSchema,
  updateStudentProfileValidationSchema,
  submitTaskValidationSchema,
  teacherReviewValidationSchema,
};
