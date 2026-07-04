import { useState } from "react";
import { ApiResponse } from "../Models/Generics/ApiResponse";

type MutationOptions<T, P> = {
    onSuccess?: (result: T, payload?: P) => void;
    onError?: (error: any, payload?: P) => void;
    optimisticUpdate?: (payload?: P) => void; // update UI before server response
};

export function useMutationApi<T, P = any>(
    serviceFn: (payload?: P) => Promise<T>,
    options?: MutationOptions<T, P>
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = async (payload?: P): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const result = await serviceFn(payload);

            const resModel = new ApiResponse(result);
            if (resModel.isSuccess() && options?.onSuccess) {
                options.onSuccess(result, payload);

                if (options?.optimisticUpdate) {
                    options.optimisticUpdate(payload);
                }
            }
            else if (resModel.isFailure()) {

                if (options?.onError) {
                    options.onError("", payload);
                }
            }

            return result;
        } catch (err: any) {
            setError(err.message ?? "Something went wrong");

            if (options?.onError) {
                options.onError(err, payload);
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
}