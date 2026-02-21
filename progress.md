# SkillBridge — Local Setup Progress

## ✅ What Was Done to Make This Project Run Locally

### 1. Analyzed the Project Structure
- Reviewed `package.json` to understand the tech stack: **Next.js 16**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and **Radix UI** components.
- Reviewed `README.md` for setup instructions.
- Reviewed `next.config.mjs` — no special environment variables required.
- Reviewed `middleware.ts` — uses cookie-based mock authentication (no external services needed).

### 2. Installed `pnpm` Package Manager
- The project uses `pnpm` (as indicated by `pnpm-lock.yaml`), but it was not installed on the system.
- Installed `pnpm` globally using npm:

```bash
npm install -g pnpm
```

### 3. Installed Project Dependencies
- Ran `pnpm install` inside the project directory.
- Downloaded and installed **257 packages**, including:
  - `next@16.1.6`
  - `react@19.2.3`
  - `tailwindcss@3.4.19`
  - All `@radix-ui/*` components
  - `lucide-react`, `recharts`, `zod`, `react-hook-form`, etc.

```bash
pnpm install
```

### 4. Started the Development Server
- Ran the dev script which uses **Next.js with Turbopack** for fast builds:

```bash
pnpm dev
```

- The server started successfully at:
  - **Local:** http://localhost:3000
  - **Network:** http://192.168.0.104:3000

---

## 🖥️ Commands to Run This Project Locally (Step by Step)

> **Prerequisites:** Make sure you have **Node.js** installed on your machine.

### Step 1 — Install pnpm (only needed once)
```bash
npm install -g pnpm
```

### Step 2 — Navigate to the project folder
```bash
cd "e:\CODE-BASE\Level 2\Mission 5\v0-skill-bridge-project-setup - Copy"
```

### Step 3 — Install project dependencies
```bash
pnpm install
```

### Step 4 — Start the development server
```bash
pnpm dev
```

### Step 5 — Open in browser
Navigate to: **http://localhost:3000**

---

## 📋 Other Useful Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server (with Turbopack) |
| `pnpm build` | Build the project for production |
| `pnpm start` | Start the production server (after build) |
| `pnpm lint` | Run ESLint to check for code issues |

---

## ⚠️ Notes

- There is a **deprecation warning** about `middleware.ts` — Next.js 16 recommends using a `proxy` file instead. This does **not** break the app; it still works fine.
- No `.env` file is required — the project uses **mock/in-memory authentication** with cookies.
- Test credentials for different roles can be found in **`TEST_CREDENTIALS.md`**.

---

## 🔐 Test Credentials (from TEST_CREDENTIALS.md)

See the `TEST_CREDENTIALS.md` file in the project root for login credentials for:
- **Student** role
- **Tutor** role
- **Admin** role
