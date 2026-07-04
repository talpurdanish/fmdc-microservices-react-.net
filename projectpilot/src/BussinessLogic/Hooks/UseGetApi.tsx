import { useState, useEffect, useCallback, useRef } from "react";

type GetOptions<P> = {
    payload?: P;
    immediate?: boolean;
    debounceMs?: number;
    throttleMs?: number;
};

export function useGetApi<T, P = any>(
    serviceFn: (payload?: P) => Promise<T>,
    options: GetOptions<P> = {},
    deps: any[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastCall = useRef<number>(0);

    const execute = useCallback(async (payload?: P) => {
        setLoading(true);
        setError(null);
        try {
            const result = await serviceFn(payload);
            setData(result);
            return result;
        } catch (err: any) {
            setError(err?.message ?? "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    }, [serviceFn]); // Only recreate if serviceFn changes

    const fetchData = useCallback((payloadOverride?: P) => {
        const { payload, debounceMs, throttleMs } = options;
        const payloadToUse = payloadOverride ?? payload;

        const now = Date.now();

        // Handle Throttle
        if (throttleMs) {
            if (now - lastCall.current >= throttleMs) {
                lastCall.current = now;
                execute(payloadToUse);
            }
            return;
        }

        // Handle Debounce
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        const delay = debounceMs ?? 300;
        debounceTimer.current = setTimeout(() => {
            execute(payloadToUse);
        }, delay);
    }, [execute, options.debounceMs, options.throttleMs, options.payload]);

    useEffect(() => {
        if (options?.immediate) {
            fetchData();
        }
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps]);

    return { data, error, loading, execute, refetch: fetchData };
}