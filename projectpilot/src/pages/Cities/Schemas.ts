import z from "zod";

export const createSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    provinceId: z.number({ required_error: "Province is required" }),
    id: z.number(),
});


export type CreateFormData = z.infer<typeof createSchema>;

export type FormData = CreateFormData;