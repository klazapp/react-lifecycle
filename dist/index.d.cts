type LifecycleHooks<TArgs extends any[], TResult> = {
    before?: (...args: TArgs) => void | Promise<void>;
    after?: (result: TResult) => void | Promise<void>;
    onError?: (error: any) => void | Promise<void>;
    finally?: () => void | Promise<void>;
};
declare function withLifecycle<TArgs extends any[], TResult>(fn: (...args: TArgs) => Promise<TResult> | TResult, hooks?: LifecycleHooks<TArgs, TResult>): (...args: TArgs) => Promise<{
    ok: true;
    result: TResult;
} | {
    ok: false;
    error: any;
}>;

export { type LifecycleHooks, withLifecycle };
