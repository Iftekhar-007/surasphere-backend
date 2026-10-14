import { z } from "zod";

export const bookTrialValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Full Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name cannot exceed 80 characters"),
    email: z
      .string({ message: "Email is required" })
      .email("Please provide a valid email address"),
    phone: z.string().optional().nullable(),
    course: z.string().optional().nullable(),
    ageGroup: z.string().optional().nullable(),
    preferredTime: z.string().optional().nullable(),
    message: z.string().max(1000, "Message cannot exceed 1000 characters").optional().nullable(),
  }),
});

export const TrialValidations = {
  bookTrialValidationSchema,
};
