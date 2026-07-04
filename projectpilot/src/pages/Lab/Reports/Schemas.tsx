import { z } from "zod";

export const createSchema = z.object({
    id: z.number(),
    deliveryDate: z.date().refine((d) => !!d, {
        message: "Delivery date is required",
    }),
    testId: z.number().min(1, { message: "Test ID is required" }),
    patientId: z.number().min(1, { message: "Patient ID is required" }),
    doctorId: z.number().min(1, { message: "Doctor ID is required" }),
    note: z.string().max(1000, { message: "Note must be at most 1000 characters" }).optional(),
});



export type CreateFormData = z.infer<typeof createSchema>;
