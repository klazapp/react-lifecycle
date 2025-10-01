export type LifecycleHooks<TArgs extends any[], TResult> = {
    before?: (...args: TArgs) => void | Promise<void>;
    after?: (result: TResult) => void | Promise<void>;
    onError?: (error: any) => void | Promise<void>;
    finally?: () => void | Promise<void>;
};

export function withLifecycle<TArgs extends any[], TResult>(
    fn: (...args: TArgs) => Promise<TResult> | TResult,
    hooks: LifecycleHooks<TArgs, TResult> = {}
) {
    return async (...args: TArgs): Promise<
        { ok: true; result: TResult } | { ok: false; error: any }
    > => {
        try {
            if (hooks.before) await hooks.before(...args);

            const result = await fn(...args);

            if (hooks.after) await hooks.after(result);

            return { ok: true, result };
        } catch (error) {
            if (hooks.onError) await hooks.onError(error);
            return { ok: false, error };
        } finally {
            if (hooks.finally) await hooks.finally();
        }
    };
}
