# Production-Grade Next.js Project

## Tech Stack Overview
- **Framework**: Next.js (App Router, latest stable)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI under the hood)
- **Icons**: lucide-react
- **Data Fetching/Mutations**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form (RHF) + Zod
- **Font**: Rubik (via `next/font/google`)

## Folder Structure

This project uses a **feature-based** folder structure, rather than a type-based one. This ensures that all components, types, utilities, and hooks related to a specific feature live together.

```
src/
  app/                          # Next.js App Router routes only (thin, no business logic)
    (auth)/
      login/page.tsx
      register/page.tsx
    (protected)/
      dashboard/page.tsx
    layout.tsx
    globals.css
  middleware.ts                 # Route protection logic
  features/
    auth/
      api/                     # Axios calls + react-query hooks for this feature
        auth.api.ts
        auth.mutations.ts
      components/              # Feature-specific components
        LoginForm.tsx
        RegisterForm.tsx
      types/                   # Feature-specific types
        auth.types.ts
      index.ts                 # Barrel export for the feature
    [other-features]/
      ...
  components/
    ui/                        # shadcn/ui generic components
    common/                    # Shared generic components (Navbar, Footer, etc.)
  lib/
    axios.ts                   # Configured axios instance + interceptors
    query-client.ts            # react-query client setup
    utils.ts                   # Utility functions
  hooks/                       # Global generic hooks
  types/                       # Global shared types
  config/
    site.ts                    # Site configuration, env-driven config
  providers/
    QueryProvider.tsx          # Providers wrapping the app
```

## Conventions

- **Naming**: Use camelCase for functions/variables, PascalCase for React components and files containing React components, and kebab-case for generic folders (unless it's a feature name which is usually single word). The user prefers kebab-case.
- **Adding a new feature**: Create a new folder under `src/features/`. Include `api`, `components`, `types`, etc., inside it. Expose the public API of the feature via an `index.ts` (barrel export).
- **Routing**: Keep `src/app` routes thin. They should primarily handle routing and layout, delegating business logic and UI to components within `src/features`.
- **Theming**: Do not add multiple themes. There is only one default theme.
- **Forms**: Always use React Hook Form (RHF) integrated with Zod for schema validation.

## Data Fetching Pattern

We use Axios configured with an interceptor inside `src/lib/axios.ts` to attach tokens (if applicable) and handle centralized errors (like 401 redirects).
We use TanStack Query to manage the server state on the client.

Example:
```tsx
// features/users/api/users.api.ts
import { api } from "@/lib/axios";

export const fetchUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

// features/users/api/users.queries.ts
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./users.api";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
```

## Auth / Route Protection Flow

Route protection is handled via Next.js Middleware (`src/middleware.ts`).
- It checks for the presence of a `token` in the cookies.
- Unauthenticated users trying to access `protectedRoutes` (e.g., `/dashboard`) are redirected to `/login`.
- Authenticated users trying to access `authRoutes` (e.g., `/login`, `/register`) are redirected to `/dashboard`.

## Commands

- **Run Dev Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint**: `npm run lint`
- **Add new shadcn component**: `npx -y shadcn@latest add <component-name>`

## Notes for Future AI Agents

- Always adhere to the feature-based folder structure. Do not create global `src/api` or `src/models` directories.
- Always use `@/` alias for absolute imports.
- Avoid placing complex business logic in `page.tsx` files. Extract it into feature components or custom hooks.
- Use `lucide-react` for any icon requirements.
- Ensure strict TypeScript typing. Avoid `any` types.
