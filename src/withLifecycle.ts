/**
 * Lifecycle hooks that can be attached to any wrapped function.
 *
 * @template TArgs Arguments type of the function being wrapped
 * @template TResult Result type of the function being wrapped
 */
export type LifecycleHooks<TArgs extends any[], TResult> = {
    /**
     * Called before the wrapped function executes.
     * Can perform setup, logging, validation, etc.
     */
    before?: (...args: TArgs) => void | Promise<void>;

    /**
     * Called after the wrapped function successfully resolves.
     * Receives the result for inspection, transformation, or logging.
     */
    after?: (result: TResult) => void | Promise<void>;

    /**
     * Called if the wrapped function throws or rejects.
     * Receives the error so it can be logged or transformed.
     */
    onError?: (error: any) => void | Promise<void>;

    /**
     * Called after everything else, regardless of success or failure.
     * Use for cleanup actions like closing connections.
     */
    finally?: () => void | Promise<void>;
};

/**
 * Wraps any synchronous or asynchronous function with lifecycle hooks.
 *
 * The wrapped function always returns a standardized result:
 * - `{ ok: true, result }` if the function succeeds
 * - `{ ok: false, error }` if the function throws or rejects
 *
 * @example
 * ```ts
 * const divide = withLifecycle(
 *   async (a: number, b: number) => {
 *     if (b === 0) throw new Error("Divide by zero");
 *     return a / b;
 *   },
 *   {
 *     before: (a, b) => console.log("Starting division:", a, b),
 *     after: (result) => console.log("Result:", result),
 *     onError: (err) => console.error("Error:", err),
 *     finally: () => console.log("Done with division"),
 *   }
 * );
 *
 * const res1 = await divide(10, 2);
 * // Logs: "Starting division: 10 2"
 * //       "Result: 5"
 * //       "Done with division"
 * // res1 = { ok: true, result: 5 }
 *
 * const res2 = await divide(10, 0);
 * // Logs: "Starting division: 10 0"
 * //       "Error: Error: Divide by zero"
 * //       "Done with division"
 * // res2 = { ok: false, error: Error("Divide by zero") }
 * ```
 *
 * @param fn Function to wrap
 * @param hooks Lifecycle hooks to attach
 * @returns A new function that enforces lifecycle behavior and returns standardized results
 */
export function withLifecycle<TArgs extends any[], TResult>(
    fn: (...args: TArgs) => Promise<TResult> | TResult,
    hooks: LifecycleHooks<TArgs, TResult> = {}
) {
    return async (
        ...args: TArgs
    ): Promise<{ ok: true; result: TResult } | { ok: false; error: any }> => {
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
