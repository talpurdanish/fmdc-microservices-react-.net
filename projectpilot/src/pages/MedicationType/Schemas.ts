import { z } from "zod";

export const createSchema = z.object({
    id: z.number({
        required_error: "Medication Type ID is required",
        invalid_type_error: "Medication Type ID must be a number",
    }),

    name: z.string({
        required_error: "Medication Type Name is required",
        invalid_type_error: "Medication Type Name must be a string",
    })
        .min(1, { message: "Medication Type Name is required" })
        .max(1000, { message: "Medication Type Name cannot exceed 1000 characters" }),
});


export type CreateFormData = z.infer<typeof createSchema>;



