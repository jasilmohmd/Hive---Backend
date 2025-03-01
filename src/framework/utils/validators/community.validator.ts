import { z } from "zod";
import { Types } from "mongoose";

// Custom transform function to convert string to ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  })
  .transform((val) => new Types.ObjectId(val)); // Convert to ObjectId

export const communityValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Community name must be at least 3 characters long." })
    .max(50, { message: "Community name cannot exceed 50 characters." }),

  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters." })
    .optional(),

  type: z.enum(["public", "private"], {
    errorMap: () => ({ message: "Type must be either 'public' or 'private'." }),
  }),

  ownerId: objectIdSchema, // ✅ Now returns `Types.ObjectId`

  tags: z
    .array(objectIdSchema) // ✅ Now each tag is an ObjectId
    .default([]),
});
