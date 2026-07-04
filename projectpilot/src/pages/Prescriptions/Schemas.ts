import * as z from "zod";


export const createSchemaMedications = z.object({
    diagnosis: z.string().max(1000, { message: "Diagnosis cannot exceed 1000 chars" }),
    remarks: z.string().max(1000, { message: "Remarks cannot exceed 1000 chars" }),
    medicationId: z.number().optional(),
    quantity: z.number().optional(),
    times: z.number().optional(),
    unit: z.string().optional()
}).superRefine((data, ctx) => {
    if (data.medicationId !== undefined) {
        if (data.quantity === undefined) {
            ctx.addIssue({
                path: ["quantity"],
                code: z.ZodIssueCode.custom,
                message: "Quantity is required when medicationId is provided",
            });
        }
        if (data.times === undefined) {
            ctx.addIssue({
                path: ["times"],
                code: z.ZodIssueCode.custom,
                message: "Times is required when medicationId is provided",
            });
        }
        if (!data.unit) {
            ctx.addIssue({
                path: ["unit"],
                code: z.ZodIssueCode.custom,
                message: "Unit is required when medicationId is provided",
            });
        }
    }
});

export type CreateFormDataMedication = z.infer<typeof createSchemaMedications>;






