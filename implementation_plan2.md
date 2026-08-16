# Implementation Plan - BlackBook AI (College Project Black Book Generator)

Build a complete, production-ready MVP of **BlackBook AI**—an AI-powered Academic Project Report ("Black Book") Generator specifically tailored for final-year Indian engineering students.

## User Requirements & Domain Scope

> [!IMPORTANT]
> - **Domain Target**: Final-year Engineering Students (Computer Science, Information Technology, AI & Data Science, Electronics, etc.).
> - **Project Model Attributes**: Title, Branch, Tech Stack, Description, College Name, Student Name, Guide Name, Academic Year.
> - **Academic Chapter Structure**:
>   1. **Chapter 1: Introduction** (Background, Problem Statement, Objectives, Scope)
>   2. **Chapter 2: Literature Survey** (Existing Systems, Comparative Analysis, Proposed System)
>   3. **Chapter 3: Requirement Analysis** (Hardware/Software Specs, Feasibility Study, Functional & Non-Functional Requirements)
>   4. **Chapter 4: System Design** (Architecture, Use Case Diagram, Class Diagram, ER Diagram, DFD Level 0/1 with Mermaid syntax & descriptions)
>   5. **Chapter 5: Implementation** (Module Descriptions, Algorithms, Core Snippets & Workflow)
>   6. **Chapter 6: Testing** (Test Strategy, Test Cases Table, Unit & Integration Test Results)
>   7. **Chapter 7: Conclusion & Future Scope** (Summary, Advantages, Future Enhancements)
>   8. **References** (IEEE Citation Format)
> - **Word Count Target Controls**: Short ≈ 400 words, Medium ≈ 700 words, Long ≈ 1000 words.
> - **Academic Exporting**: Export to DOCX & PDF formatted to Indian Engineering University standards (Times New Roman, 1.5 line spacing, 12pt body font, 14/16pt bold headings, title page layout).
> - **UI Theme**: Modern dark theme (`#0f172a` main background, `#1e293b` card surfaces, `#38bdf8` cyan accent).

---

## Component & Service Architecture

### 1. Data Models (`src/app/models/`)
- [`src/app/models/user.model.ts`](file:///w:/Generator/blackbook-ai/src/app/models/user.model.ts) [NEW]:
  - `User`: `id`, `name`, `email`, `role`, `college`, `token`, `wordCredits`, `plan` ('free' | 'pro' | 'unlimited').
- [`src/app/models/project.model.ts`](file:///w:/Generator/blackbook-ai/src/app/models/project.model.ts) [NEW]:
  - `Project`: `id`, `title`, `branch` (e.g. CSE, IT, AI/DS, EXTC), `techStack` (e.g. Angular, Node.js, TensorFlow, Python), `description`, `collegeName`, `studentName`, `guideName`, `academicYear`, `chapters` (`Chapter[]`), `createdAt`, `updatedAt`.
- [`src/app/models/chapter.model.ts`](file:///w:/Generator/blackbook-ai/src/app/models/chapter.model.ts) [NEW]:
  - `Chapter`: `id`, `chapterNumber`, `title`, `synopsis`, `wordCountTarget` ('short' | 'medium' | 'long'), `content`, `mermaidDiagrams` (`MermaidDiagram[]`), `status` ('draft' | 'generating' | 'completed'), `wordCountActual`, `lastUpdated`.
  - `WordCountTarget`: `'short'` (400 words) | `'medium'` (700 words) | `'long'` (1000 words).
  - `MermaidDiagram`: `type` ('usecase' | 'class' | 'er' | 'dfd'), `code`, `description`.

### 2. Core Services (`src/app/core/services/`)
- [`src/app/core/services/auth.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/auth.ts): Session state with Angular Signals, demo login, signup, logout, credit tracking.
- [`src/app/core/services/project.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/project.ts): Project state store, default academic project templates (e.g. "Smart AI Medical Diagnostics System", "Blockchain-based Supply Chain Portal"), CRUD operations for projects & academic chapters.
- [`src/app/core/services/gemini.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/gemini.ts): Academic report prompt builder for Gemini API with word count parameters, diagram generation (Mermaid.js code for System Design), and fallback academic generator.
- [`src/app/core/services/export.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/export.ts): Academic formatting exporter (DOCX with Times New Roman / 1.5 spacing, PDF view, Markdown, HTML with title page & certificate templates).
- [`src/app/core/services/payment.ts`](file:///w:/Generator/blackbook-ai/src/app/core/services/payment.ts): Student plans & token packages.
- [`src/app/core/guards/auth.guard.ts`](file:///w:/Generator/blackbook-ai/src/app/core/guards/auth.guard.ts) [NEW]: Functional route guard.

### 3. Layout & Shared UI (`src/app/layout/` & `src/app/shared/`)
- [`src/app/layout/main-layout/main-layout.ts`](file:///w:/Generator/blackbook-ai/src/app/layout/main-layout/main-layout.ts): Primary layout shell integrating Sidebar, Header, and `<router-outlet>`.
- [`src/app/shared/components/sidebar/sidebar.ts`](file:///w:/Generator/blackbook-ai/src/app/shared/components/sidebar/sidebar.ts): "BlackBook AI" logo, engineering branch badge, navigation items (Dashboard, My Projects, Report Generator, Export, Pricing), active chapter indicator.
- [`src/app/shared/components/header/header.ts`](file:///w:/Generator/blackbook-ai/src/app/shared/components/header/header.ts): Top navigation bar, current project selector, "+ New Black Book" action button, student profile badge, logout action.
- [`src/app/shared/components/loading-spinner/loading-spinner.ts`](file:///w:/Generator/blackbook-ai/src/app/shared/components/loading-spinner/loading-spinner.ts): Sleek academic generation loader with animated chapter progress.

### 4. Feature Modules & Components (`src/app/features/`)
- **Auth**:
  - [`src/app/features/auth/login/login.ts`](file:///w:/Generator/blackbook-ai/src/app/features/auth/login/login.ts): Student login screen with quick demo login buttons.
  - [`src/app/features/auth/signup/signup.ts`](file:///w:/Generator/blackbook-ai/src/app/features/auth/signup/signup.ts): Student signup form with branch & college input.
- **Dashboard**:
  - [`src/app/features/dashboard/dashboard/dashboard.ts`](file:///w:/Generator/blackbook-ai/src/app/features/dashboard/dashboard/dashboard.ts): Student metrics (Black Books Created, Total Generated Pages/Words, System Diagrams Created), Quick Start project launcher, recent project cards.
- **Projects**:
  - [`src/app/features/projects/project-list/project-list.ts`](file:///w:/Generator/blackbook-ai/src/app/features/projects/project-list/project-list.ts): Academic projects catalog with branch filters (CSE, IT, AI/DS, EXTC), progress bars, export & generate shortcuts.
  - [`src/app/features/projects/project-form/project-form.ts`](file:///w:/Generator/blackbook-ai/src/app/features/projects/project-form/project-form.ts): Academic project creation form capturing Title, Branch, Tech Stack, Description, College Name, Student Name, Guide Name, Academic Year, auto-populating the 7 standard Black Book chapters + References.
- **Generator**:
  - [`src/app/features/generator/chapter-generator/chapter-generator.ts`](file:///w:/Generator/blackbook-ai/src/app/features/generator/chapter-generator/chapter-generator.ts):
    - Select standard chapter (1 to 7 + References).
    - Length selector (Short ≈ 400 words, Medium ≈ 700 words, Long ≈ 1000 words).
    - Academic customization parameters (e.g. Include UML Diagrams for Ch 4, Test Case Table for Ch 6, IEEE Citations for Ref).
    - AI Generate trigger with live status.
  - [`src/app/features/generator/chapter-editor/chapter-editor.ts`](file:///w:/Generator/blackbook-ai/src/app/features/generator/chapter-editor/chapter-editor.ts):
    - Split-screen / tabbed layout: Markdown & Academic Text Editor + Live Diagram & Preview.
    - Word counter & target progress indicator.
    - AI Refine buttons ("Expand Section", "Add Technical Detail", "Generate UML Diagram").
- **Export**:
  - [`src/app/features/export/export-page/export-page.ts`](file:///w:/Generator/blackbook-ai/src/app/features/export/export-page/export-page.ts):
    - Academic Project Report preview (Title Page format, Certificate Page format, Table of Contents, Chapter Content with Diagrams).
    - DOCX export download button (academic styling: Times New Roman, 1.5 spacing, 12pt body, 1.25" margins).
    - PDF export / Print view button.
- **Pricing**:
  - [`src/app/features/pricing/pricing-page/pricing-page.ts`](file:///w:/Generator/blackbook-ai/src/app/features/pricing/pricing-page/pricing-page.ts):
    - Student-friendly plans: Free Pass (1 Project), Student Pro (Unlimited Chapters + DOCX/PDF export + Diagram generation), Team Plan.

---

## Routing & App Configuration
- [`src/app/app.routes.ts`](file:///w:/Generator/blackbook-ai/src/app/app.routes.ts): Route mapping for Main Layout shell, Auth routes, Dashboard, Projects, Generator, Export, Pricing.
- [`src/styles.scss`](file:///w:/Generator/blackbook-ai/src/styles.scss): Dark UI theme styling (`#0f172a` bg, `#1e293b` cards, `#38bdf8` cyan accents), typography, inputs, badges, glassmorphism cards.

---

## Verification Plan

### Automated Verification
- Run `npm run build` to verify Angular compilation, type safety, and templates.

### Manual Functional Verification
- Verify student login & profile state.
- Create a new Black Book project with college details (Title, Branch, Tech Stack, Guide Name, Student Name).
- Test generating Chapter 1, Chapter 4 (with Mermaid diagram code), and Chapter 6 (with test case tables) across Short (400w), Medium (700w), and Long (1000w) target presets.
- Test editing chapter contents in `chapter-editor`.
- Test exporting complete project to formatted DOCX and PDF/Print.
