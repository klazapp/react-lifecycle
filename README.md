# Klazapp Lifecycle

A tiny, flexible **TypeScript utility** for React and Node.js projects.
Provides a **lifecycle wrapper** for async functions with hooks for `before`, `after`, `onError`, and `finally`.
Ensures consistent results in the shape `{ ok, result }` or `{ ok, error }`, with automatic cleanup.

---

## ⭐ Why use this?

Most projects handle async errors with `try/catch` scattered everywhere:

* Boilerplate is repeated across controllers, jobs, and scripts
* Easy to forget `finally` cleanup steps
* Logs are inconsistent and sometimes missing
* Uncaught errors can leak stack traces or crash apps

**Klazapp Lifecycle** solves this with a clean, reusable wrapper.

---

### 🔍 Comparison

| Aspect                  | Native `try/catch`          | Lifecycle Wrapper                                   |
| ----------------------- | --------------------------- | --------------------------------------------------- |
| **Error handling**      | Manual `catch` everywhere   | Consistent `{ ok, error }` shape                    |
| **Cleanup**             | Must remember `finally`     | Guaranteed `finally` hook                           |
| **Cross-cutting logic** | Hard to inject consistently | Centralized `before`, `after`, `onError`, `finally` |
| **Readability**         | Verbose and repetitive      | One-line wrapper                                    |

---

### ✅ Key benefits

* **Consistent result shape**: `{ ok: true, result }` or `{ ok: false, error }`
* **Lifecycle hooks**: `before`, `after`, `onError`, `finally` for cross-cutting concerns
* **Automatic cleanup**: guarantees `finally` always runs
* **Less boilerplate**: replaces repeated `try/catch/finally` blocks
* **Cross-environment**: works in controllers, jobs, event handlers, and CLI scripts

---

## 📦 Installation

### From npm (once published)

```bash
npm i @klazapp-utils/lifecycle
```

### From GitHub

```bash
npm i github:klazapp/lifecycle
```

---

## 🚀 Usage

### 1. Wrap an async function

```ts
import { withLifecycle } from "@klazapp-utils/lifecycle";

const safeDivide = withLifecycle(
  async (a: number, b: number) => {
    if (b === 0) throw new Error("divide by zero");
    return a / b;
  },
  {
    before: () => console.log("Starting division..."),
    after: (result) => console.log("Result was:", result),
    onError: (err) => console.error("Error:", err.message),
    finally: () => console.log("Done"),
  }
);

const r1 = await safeDivide(10, 2); // { ok: true, result: 5 }
const r2 = await safeDivide(10, 0); // { ok: false, error: Error("divide by zero") }
```

**Output:**

```
Starting division...
Result was: 5
Done

Starting division...
Error: divide by zero
Done
```

---

### 2. Use at boundaries

Controllers, jobs, and CLI scripts can wrap their core logic:

```ts
const safeHandler = withLifecycle(handlerFn, {
  onError: (err) => logger.error("Handler failed", err),
  finally: () => logger.info("Handler finished"),
});

const { ok, result, error } = await safeHandler(req, res);
```

---

## ⚙️ Typical hooks

* `before`: validate input, log start time
* `after`: send metrics, log results
* `onError`: catch and log errors, trigger alerts
* `finally`: cleanup resources, always runs

---

## 📖 Roadmap

* [ ] Add `wrapAsync` shortcut (no hooks, just `{ ok, error }`)
* [ ] Add `retryAsync` with backoff
* [ ] Add `timeoutAsync` for cancellation
* [ ] Add concurrency limiters

---

## 📜 License

MIT © Klazapp
