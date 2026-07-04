import { z } from "zod";

export const createSchema = z.object({
    id: z.number({
        required_error: "Id is required",
        invalid_type_error: "Id must be a number",
    }),
    cost: z.number({
        required_error: "Cost is required",
        invalid_type_error: "Cost must be a number",
    }),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    })
        .min(1, { message: "Name is required" })
        .max(1000, { message: "Name cannot exceed 1000 characters" }),

    description: z.string().optional(),
});

export type CreateFormData = z.infer<typeof createSchema>;



