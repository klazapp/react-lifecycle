// src/withLifecycle.ts
function withLifecycle(fn, hooks = {}) {
  return async (...args) => {
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

export { withLifecycle };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map