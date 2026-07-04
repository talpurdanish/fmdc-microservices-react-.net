import { z } from "zod";

export const createSchema = z.object({
    id: z.number({
        invalid_type_error: "Id must be a number",
    }).optional(), // optional since not marked required in your C# model

    name: z.string({
        required_error: "Procedure Name is required",
        invalid_type_error: "Procedure Name must be a string",
    }).max(250, { message: "Procedure Name should be less than 250 characters" }),

    cost: z.number({
        required_error: "Procedure Cost is required",
        invalid_type_error: "Procedure Cost must be a number",
    }),

    type: z.string({
        invalid_type_error: "Procedure Type must be a string",
    }).optional(), // optional since not marked required

    typeID: z.number({
        required_error: "Procedure TypeID is required",
        invalid_type_error: "Procedure TypeID must be a number",
    }),
});

export type CreateFormData = z.infer<typeof createSchema>;



