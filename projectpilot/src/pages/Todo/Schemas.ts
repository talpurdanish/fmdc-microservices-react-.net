import { z } from "zod";

export const createSchema = z.object({
    id: z.number({
        invalid_type_error: "Id must be a number",
    }).optional(), // not marked required in your C# model

    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string",
    }).max(250, { message: "Title should be less than 250 characters" }),
});


export type CreateFormData = z.infer<typeof createSchema>;



