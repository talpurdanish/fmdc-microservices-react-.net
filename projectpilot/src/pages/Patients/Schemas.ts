
import { patientsService } from "../../BussinessLogic/Index.Service";

import * as z from "zod";


async function isUnique(id: number = -1, value: string): Promise<boolean> {
    const res = await patientsService.CheckUnique(value, id);
    return res;
}
// Patient schema
export const createSchema = z.object({
    id: z.number().optional(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }).min(1, { message: "Name is required" }),

    fatherName: z.string().optional(),
    cnic: z.string({
        required_error: "CNIC is required",
        invalid_type_error: "CNIC must be a string",
    })
        .min(1, { message: "CNIC is required" })
        .regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be exactly 13 digits"),
    dateofBirth: z.date({
        required_error: "Date of Birth is required",
    }).refine((d) => d <= new Date(), {
        message: "Date of Birth cannot be in the future",
    }),
    address: z.string().optional(),
    cityId: z.number().min(1, { message: "Select a City" }),
    phoneNo: z.string().optional(),
    phoneType: z.number({
        invalid_type_error: "Phone Type must be a number",
    }).min(1, { message: "Enter a valid Phone Type" }).max(2, { message: "Enter a valid Phone Type" }),
    gender: z.number({
        invalid_type_error: "Gender is required",
    }).min(0, { message: "Gender is required" }).max(2, { message: "Gender is required" }),
    bloodGroup: z.string({
        required_error: "Blood Group is required",
        invalid_type_error: "Blood Group must be a string",
    }).min(1, { message: "Blood Group is required" }),
    picture: z.string()
        .refine((val) => {
            if (!val) return true;
            const sizeInBytes = Math.ceil((val.length * 3) / 4);
            return sizeInBytes <= 1024 * 1024;
        }, { message: "File size must be less than 1MB" })
        .optional(),
}).superRefine(async (data, ctx) => {
    if (data.cnic != undefined && data.cnic != "" && data.id != undefined) {
        if ((await isUnique(data.id, data.cnic))) {
            ctx.addIssue({
                path: ["cnic"],
                code: z.ZodIssueCode.custom,
                message: "CNIC is already taken",
            });
        }
    }

});


export type CreateFormData = z.infer<typeof createSchema>;
export type FormData = CreateFormData;