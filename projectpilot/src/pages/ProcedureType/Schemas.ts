import { z } from "zod";

export const createSchema = z.object({
    id: z.number({
        required_error: "Procedure Type ID is required",
        invalid_type_error: "Procedure Type ID must be a number",
    }),

    name: z.string({
        required_error: "Procedure Type Name is required",
        invalid_type_error: "Procedure Type Name must be a string",
    })
        .min(1, { message: "Procedure Type Name is required" })
        .max(1000, { message: "Procedure Type Name cannot exceed 1000 characters" }),
});


export type CreateFormData = z.infer<typeof createSchema>;



