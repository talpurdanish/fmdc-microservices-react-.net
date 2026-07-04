import { z } from "zod";

export const createSchema = z.object({
    code: z.number({
        required_error: "Code is required",
        invalid_type_error: "Code must be a number",
    }),

    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    })
        .min(1, { message: "Name is required" })
        .max(1000, { message: "Name cannot exceed 1000 characters" }),

    brand: z.string({
        required_error: "Brand is required",
        invalid_type_error: "Brand must be a string",
    })
        .min(1, { message: "Brand is required" })
        .max(1000, { message: "Brand cannot exceed 1000 characters" }),

    description: z.string().optional(),

    typeID: z.number({
        required_error: "Medication Type ID is required",
        invalid_type_error: "Medication Type ID must be a number",
    }),
});

export type CreateFormData = z.infer<typeof createSchema>;



