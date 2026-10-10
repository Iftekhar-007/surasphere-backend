import { z } from "zod";

const emptyStringToUndefined = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
};

const optionalNumber = (min?: number, max?: number) => {
  return z.preprocess((val) => {
    const cleaned = emptyStringToUndefined(val);
    if (cleaned === undefined) return undefined;
    const num = Number(cleaned);
    return isNaN(num) ? cleaned : num;
  }, min !== undefined && max !== undefined ? z.number().min(min).max(max).optional() : min !== undefined ? z.number().min(min).optional() : z.number().optional());
};

const optionalString = () => {
  return z.preprocess((val) => {
    const cleaned = emptyStringToUndefined(val);
    if (cleaned === undefined) return undefined;
    return String(cleaned);
  }, z.string().optional());
};

const createStudentProfileValidationSchema = z.object({
  body: z.object({
    name: optionalString(),
    age: optionalNumber(1, 120),
    gender: optionalString(),
    phone: optionalString(),
    guardianName: optionalString(),
    guardianPhone: optionalString(),
    address: optionalString(),
    currentJuz: optionalNumber(1, 30),
    currentSurah: optionalString(),
    currentAyah: optionalNumber(1, 300),
    targetSurah: optionalString(),
    learningLevel: optionalString(),
  }),
});

const updateStudentProfileValidationSchema = z.object({
  body: z.object({
    name: optionalString(),
    age: optionalNumber(1, 120),
    gender: optionalString(),
    phone: optionalString(),
    guardianName: optionalString(),
    guardianPhone: optionalString(),
    address: optionalString(),
    currentJuz: optionalNumber(1, 30),
    currentSurah: optionalString(),
    currentAyah: optionalNumber(1, 300),
    targetSurah: optionalString(),
    learningLevel: optionalString(),
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
