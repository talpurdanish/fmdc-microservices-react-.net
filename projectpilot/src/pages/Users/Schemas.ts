import * as z from "zod";
import { usersService } from "../../BussinessLogic/Index.Service";
import { CheckUniqueType } from "../../BussinessLogic/Services/Users.Service";


async function isUnique(type: CheckUniqueType, id: number, value: string): Promise<boolean> {
    const res = await usersService.CheckUnique(type, value, id);
    return res;
}


export const createSchema = z.object({
    id: z.number().optional(),
    name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
    }).min(1, { message: "Name is required" }),
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
    })
        .max(15, { message: "Username cannot exceed 15 chars" })
        .min(1, { message: "Username is required" })
        .regex(/^\S+$/, { message: "Username cannot contain spaces" }),
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
    pmdcNo: z.string().optional(),
    cityId: z.number().min(1, { message: "Select a City" }),
    phoneNo: z.string().optional(),
    phoneType: z.number({
        invalid_type_error: "Phone Type must be a number",
    }).min(1, { message: "Enter a valid Phone Type" }).max(2, { message: "Enter a valid Phone Type" }),
    gender: z.number({
        invalid_type_error: "Gender is required",
    }).min(0, { message: "Gender is required" }).max(2, { message: "Gender is required" }),
    role: z.number({
        invalid_type_error: "Role must be a number",
    }).min(1, { message: "Role is required" }).max(3, { message: "Role is required" }),
    picture: z.string()
        .refine((val) => {
            if (!val) return true;
            const sizeInBytes = Math.ceil((val.length * 3) / 4);
            return sizeInBytes <= 1024 * 1024;
        }, { message: "File size must be less than 1MB" })
        .optional(),

}).superRefine(async (data, ctx) => {
    if (data.username != undefined && data.username != "" && data.id != undefined) {
        if (!(await isUnique(CheckUniqueType.username, data.id, data.username))) {
            ctx.addIssue({
                path: ["username"],
                code: z.ZodIssueCode.custom,
                message: "Username is already taken",
            });
        }
    }
    if (data.cnic != undefined && data.cnic != "" && data.id != undefined) {
        if (!(await isUnique(CheckUniqueType.cnic, data.id, data.cnic))) {
            ctx.addIssue({
                path: ["cnic"],
                code: z.ZodIssueCode.custom,
                message: "CNIC is already taken",
            });
        }
    }
    if (data.pmdcNo != undefined && data.pmdcNo != "" && data.id != undefined) {
        if (data.pmdcNo && !(await isUnique(CheckUniqueType.pmdcno, data.id, data.pmdcNo))) {
            ctx.addIssue({
                path: ["pmdcNo"],
                code: z.ZodIssueCode.custom,
                message: "PMDC No is already taken",
            });
        }
    }
});

export type CreateFormData = z.infer<typeof createSchema>;
export type FormData = CreateFormData;


export const createMissingSchema = z.object({
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
    pmdcNo: z.string().optional(),
    cityId: z.number().min(1, { message: "Select a City" }),
    phoneNo: z.string().optional(),
    phoneType: z.number({
        invalid_type_error: "Phone Type must be a number",
    }).min(1, { message: "Enter a valid Phone Type" }).max(2, { message: "Enter a valid Phone Type" }),
    gender: z.number({
        invalid_type_error: "Gender is required",
    }).min(0, { message: "Gender is required" }).max(2, { message: "Gender is required" }),
    role: z.number({
        invalid_type_error: "Role must be a number",
    }).min(1, { message: "Role is required" }).max(3, { message: "Role is required" }),
    picture: z.string()
        .refine((val) => {
            if (!val) return true;
            const sizeInBytes = Math.ceil((val.length * 3) / 4);
            return sizeInBytes <= 1024 * 1024;
        }, { message: "File size must be less than 1MB" })
        .optional(),

}).superRefine(async (data, ctx) => {

    if (data.cnic != undefined && data.cnic != "") {
        if (!(await isUnique(CheckUniqueType.cnic, -1, data.cnic))) {
            ctx.addIssue({
                path: ["cnic"],
                code: z.ZodIssueCode.custom,
                message: "CNIC is already taken",
            });
        }
    }
    if (data.pmdcNo != undefined && data.pmdcNo != "") {
        if (data.pmdcNo && !(await isUnique(CheckUniqueType.pmdcno, -1, data.pmdcNo))) {
            ctx.addIssue({
                path: ["pmdcNo"],
                code: z.ZodIssueCode.custom,
                message: "PMDC No is already taken",
            });
        }
    }
});


export type MissingFormData = z.infer<typeof createMissingSchema>;