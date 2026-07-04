import { z } from "zod";

export const createSchema = z.object({
    id: z.number({
        required_error: "Id is required",
        invalid_type_error: "Id must be a number",
    }),

    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }).max(100, { message: "Name should be less than 100 characters" }),

    maleMaxValue: z.number({
        required_error: "Male Max Value is required",
        // invalid_type_error: "Male Max Value must be a number",
    }),

    maleMinValue: z.number({
        required_error: "Male Min Value is required",
        // invalid_type_error: "Male Min Value must be a number",
    }),

    femaleMaxValue: z.number({
        invalid_type_error: "Female Max Value must be a number",
    }).optional(),

    femaleMinValue: z.number({
        invalid_type_error: "Female Min Value must be a number",
    }).optional(),

    unit: z.string({
        required_error: "Unit is required",
        invalid_type_error: "Unit must be a string",
    }),

    testId: z.number({
        required_error: "Test is required",
        invalid_type_error: "TestId must be a number",
    }),

    referenceRange: z.string({
        invalid_type_error: "ReferenceRange must be a string",
    }).optional(),

    status: z.boolean({
        invalid_type_error: "Status must be a boolean",
    }).optional(),

    gender: z.boolean({
        invalid_type_error: "Gender must be a boolean",
    }).optional(),

});


export type CreateFormData = z.infer<typeof createSchema>;



