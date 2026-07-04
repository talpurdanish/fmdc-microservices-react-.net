import React from "react";
import type { FieldErrors } from "react-hook-form";

interface FormErrorsProps {
    errors: FieldErrors<any>;
    submitError?: string | null;
    submitSuccess?: string | null;
    width?: string;
}

export const FormErrors: React.FC<FormErrorsProps> = ({ errors, submitError, submitSuccess, width = "40%" }) => {
    const errorMessages = Object.values(errors)
        .map((err) => err?.message as string)
        .filter(Boolean);

    const errorEntries = Object.entries(errors).map(([field, err]) => ({
        field,
        message: err?.message as string
    }));


    if (errorEntries.length == 0 && errorMessages.length == 0 && !submitError && !submitSuccess) return null;

    return (
        <div className={`space-y-2 rounded-sm m-5 p-1 w-[${width}] bg-amber-50 text-red-500`} >
            {/* Validation Errors */}
            {/* {errorMessages.length > 0 && (
                <ul className="list-disc pl-5 text-red-600 text-sm space-y-1">
                    {errorMessages.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                    ))}
                </ul>
            )} */}

            {errorEntries.length > 0 && (
                <ul className="list-disc pl-5 text-red-600 text-sm space-y-1">
                    {errorEntries.map((msg, idx) => (
                        <li key={idx}>{msg.field}: {msg.message}</li>
                    ))}
                </ul>
            )}

            {/* Submission Error */}
            {errorEntries.length <= 0 && !submitSuccess && submitError && (
                <div className="text-red-600 text-sm font-medium">
                    {submitError}
                </div>
            )}

            {/* Submission Success */}
            {errorEntries.length <= 0 && submitSuccess && !submitError && (
                <div className="text-green-600 text-sm font-medium">
                    {submitSuccess}
                </div>
            )}
        </div>
    );
};