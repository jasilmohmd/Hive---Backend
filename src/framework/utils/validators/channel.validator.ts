import { z } from "zod";
import { Types } from "mongoose";

// Custom Zod schema for validating MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  })
  .transform((val) => new Types.ObjectId(val)); // Converts string to ObjectId

// Zod schema for Channel Validation
export const channelValidator = z.object({
  communityId: objectIdSchema, // Ensure it's a valid MongoDB ObjectId
  name: z
    .string()
    .min(3, { message: "Channel name must be at least 3 characters long." })
    .max(50, { message: "Channel name cannot exceed 50 characters." }),

  topic: z
    .string()
    .max(100, { message: "Topic cannot exceed 100 characters." })
    .optional(),

  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters." })
    .optional(),

  createdBy: objectIdSchema, // Ensure the creator ID is a valid ObjectId

  type: z.enum(["info", "chatroom", "voice"], {
    errorMap: () => ({ message: "Type must be either 'info', 'chatroom', or 'voice'." }),
  }),

  allowedRoles: z.array(objectIdSchema).min(1, { message: "At least one role must be allowed." }),

  maxParticipants: z
    .number()
    .int()
    .positive()
    .max(1000, { message: "Max participants cannot exceed 1000." })
    .optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
