# Implementation Plan - BlackBook AI Angular 22 MVP

Build a complete, production-ready MVP of **BlackBook AI**—a modern AI-powered book and chapter generation web application.

## User Review Required

> [!IMPORTANT]
> - All components will be implemented as **Angular Standalone Components** adhering strictly to Angular 22 standards.
> - The theme features a modern dark UI (`#0f172a` primary background, `#1e293b` cards, `#38bdf8` accent cyan/sky blue).
> - Demo data will be pre-populated in `ProjectService` so the app is instantly interactive upon launch.

## Proposed Changes

### 1. Global Styles & Assets
- Update [`styles.scss`](file:///w:/Generator/blackbook-ai/src/styles.scss) with dark theme tokens, CSS custom properties, Google Fonts (Inter / Outfit), modern scrollbars, button variants, card styling, glow effects, and utility classes.

### 2. Core Models & Services
- [`src/app/models/user.model.ts`](file:///w:/Generator/blackbook-ai/src/app/models/user.model.ts) [NEW]: Interfaces for `User`, `AuthResponse`.
- [`src/app/models/project.model.ts`](file:///w:/Generator/blackbook-ai/src/app/models/project.model.ts) [NEW]: Interfaces for `Project`, `Genre`, `Tone`.
- [`src/app/models/chapter.model.ts`](file:///w:/Generator/blackbook-ai/src/app/models/chapter.model.ts) [NEW]: Interfaces for `Chapter`, `WordCountTarget`, `ExportConfig`.
- [`src/app/core/services/auth.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/auth.ts): User authentication, session signal, login, signup, logout.
- [`src/app/core/services/project.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/project.ts): Project state management, demo data, CRUD operations for projects & chapters.
- [`src/app/core/services/gemini.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/gemini.ts): Gemini AI chapter generation service with word count targets (Short ≈ 400, Medium ≈ 700, Long ≈ 1000) and fallback generator.
- [`src/app/core/services/export.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/export.ts): Book/chapter export engine (Markdown, TXT, HTML, PDF/print view).
- [`src/app/core/services/payment.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/payment.ts): Plan management, subscription status, word credit top-ups.
- [`src/app/core/guards/auth.guard.ts`](file:///w:/Generator/blackbook-ai/src/app/core/guards/auth.guard.ts) [NEW]: Route guard protecting dashboard and generator routes.

### 3. Layout & Navigation
- [`src/app/shared/components/sidebar/sidebar.ts`](file:///w:/Generator/blackbook-ai/src/app/shared/components/sidebar/sidebar.ts): Modern sidebar navigation, brand logo, word credit usage widget, nav links with active state.
- [`src/app/shared/components/header/header.ts`](file:///w:/Generator/blackbook-ai/src/app/shared/components/header/header.ts): Header bar, breadcrumbs/title, quick "+ New Project" CTA, user profile avatar menu, logout button.
- [`src/app/shared/components/loading-spinner/loading-spinner.ts`](file:///w:/Generator/blackbook-ai/src/app/shared/components/loading-spinner/loading-spinner.ts): Reusable animated loading spinner & overlay.
- [`src/app/layout/main-layout/main-layout.ts`](file:///w:/Generator/blackbook-ai/src/app/layout/main-layout/main-layout.ts): Primary application layout shell binding Sidebar, Header, and `<router-outlet>`.

### 4. Routing
- [`src/app/app.routes.ts`](file:///w:/Generator/blackbook-ai/src/app/app.routes.ts): Route definitions with lazy-loaded features and auth guard.

### 5. Feature Components
- **Auth**:
  - [`src/app/features/auth/login/login.ts`](file:///w:/Generator/blackbook-ai/src/app/features/auth/login/login.ts): Login form with validation and quick demo login button.
  - [`src/app/features/auth/signup/signup.ts`](file:///w:/Generator/blackbook-ai/src/app/features/auth/signup/signup.ts): Registration form with plan selection.
- **Dashboard**:
  - [`src/app/features/dashboard/dashboard/dashboard.ts`](file:///w:/Generator/blackbook-ai/src/app/features/dashboard/dashboard/dashboard.ts): Overview metrics, recent books, AI quick start panel, word usage stats.
- **Projects**:
  - [`src/app/features/projects/project-list/project-list.ts`](file:///w:/Generator/blackbook-ai/src/app/features/projects/project-list/project-list.ts): Grid/List view of books, search, genre filters, delete/edit options.
  - [`src/app/features/projects/project-form/project-form.ts`](file:///w:/Generator/blackbook-ai/src/app/features/projects/project-form/project-form.ts): Multi-step project creation form (Metadata, Tone, Auto-generate initial chapters outline).
- **Generator**:
  - [`src/app/features/generator/chapter-generator/chapter-generator.ts`](file:///w:/Generator/blackbook-ai/src/app/features/generator/chapter-generator/chapter-generator.ts): Chapter selector, Word Count preset pills (Short 400, Medium 700, Long 1000), AI prompt directives, real-time generation trigger.
  - [`src/app/features/generator/chapter-editor/chapter-editor.ts`](file:///w:/Generator/blackbook-ai/src/app/features/generator/chapter-editor/chapter-editor.ts): Rich text / Markdown editor, live preview, word counter, AI inline expand/refine controls, auto-save.
- **Export**:
  - [`src/app/features/export/export-page/export-page.ts`](file:///w:/Generator/blackbook-ai/src/app/features/export/export-page/export-page.ts): Multi-format book export page with live document preview.
- **Pricing**:
  - [`src/app/features/pricing/pricing-page/pricing-page.ts`](file:///w:/Generator/blackbook-ai/src/app/features/pricing/pricing-page/pricing-page.ts): Plan comparison, billing toggle, upgrade modal.

## Verification Plan

### Automated Build Verification
- Execute `npm run build` to verify TypeScript compilation and Angular template type checking.

### Manual UI Verification
- Verify navigation between Dashboard, Projects, Generator, Export, Pricing, Login, Signup.
- Test creating a new project.
- Test chapter generation with different word count settings (Short ~400, Medium ~700, Long ~1000).
- Test chapter editing and auto-save.
- Test exporting a project to Markdown / Text / HTML.
