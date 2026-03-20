# BeautyFlow — Product Operating System for Aesthetic Clinics

BeautyFlow is a multi-tenant SaaS platform designed to centralize clinic operations, improve scheduling efficiency, and increase revenue visibility. Built with a focus on scalability and clean architecture, it serves as the all-in-one operating system for aesthetic clinics, spas, and wellness studios.

---

## 🚀 Vision

BeautyFlow aims to empower clinic owners by providing:
* **Efficient Scheduling:** Manage appointments, employees, and rooms with ease.
* **Business Insights:** Real-time analytics and performance metrics.
* **Multi-Tenancy:** Secure data isolation for each clinic.
* **Global Ready:** Built-in support for internationalization (i18n).

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Backend as a Service:** [Supabase](https://supabase.com/) (Auth, Database, Storage)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Database Access:** Supabase SSR & JS Client
* **Testing:** [Vitest](https://vitest.dev/)
* **Languages:** TypeScript

---

## 🏗️ Architecture

BeautyFlow follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles to ensure maintainability and scalability.

### Layers:
1. **Domain Layer:** Core business entities and rules (located in `src/domain`).
2. **Application Layer:** Use cases and business logic orchestrators (located in `src/application`).
3. **Infrastructure Layer:** External concerns like database access, repositories, and API clients (located in `src/infrastructure`).
4. **Presentation Layer:** Next.js pages and components (located in `src/app` and `src/components`).

### Key Patterns:
* **Repository Pattern:** Abstracting data access to allow for future backend migrations (e.g., to .NET).
* **Result Pattern:** Standardizing operation outcomes to handle success and failure gracefully.
* **Multi-Tenancy:** Strict data isolation enforced via `clinic_id` and Supabase Row Level Security (RLS).

---

## 📂 Folder Structure

```text
src/
├── app/              # Next.js App Router pages and layouts
├── application/      # Use cases (Service layer)
├── domain/           # Core entities and business rules
├── infrastructure/   # Repositories and external integrations
├── components/       # UI components (shared)
├── lib/              # Shared utilities (auth, result, etc.)
└── tests/            # Vitest unit and integration tests
```

---

## 🏁 Getting Started

### Prerequisites

* Node.js (Latest LTS)
* npm / yarn / pnpm
* A Supabase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/beautyflow.git
   cd beautyflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧪 Testing

Run unit and integration tests using Vitest:

```bash
npm test
```

---

## 📜 Definition of Done

A feature is considered complete when:
- UI works correctly and follows the design system.
- Business rules are strictly enforced.
- Tests cover the new logic.
- Multi-tenancy is respected (data isolation via `clinic_id`).
- No console errors or linting warnings.

---

## 🌍 Internationalization

BeautyFlow supports multiple languages:
* English (en)
* Portuguese (pt)
* Spanish (es)
* French (fr)

---

## 🛡️ License

This project is private and intended for the BeautyFlow SaaS platform.
