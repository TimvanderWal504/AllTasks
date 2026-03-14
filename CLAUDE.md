# CLAUDE.md — ToDo PWA

This file is the single source of truth for every agent working on this project.
Read it fully before writing any code.

---

## Project

A Progressive Web App (PWA) for task management. Users can create tasks, organise
them in lists, share lists, receive push notifications and work fully offline.
The app has a secured admin environment for user and notification management.

**Jira project:** `PJM`
**Confluence space:** `PROJECTMAN`
**Confluence base URL:** `https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN`

---

## Documentation

Before writing any code for your assigned story, read the relevant Confluence pages.
They contain all functional requirements, acceptance criteria, data models,
service contracts and architectural decisions.

### Where to find what

| What | Page |
|---|---|
| Clean Code standards & Definition of Done | [TECH — Clean Code Standaarden](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/753666) |
| Technical overview — all epics | [⚙️ Technische Documentatie](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/426007) |
| Functional overview — all epics | [📋 Functionele Documentatie](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/557057) |
| Epic 1 — Auth (PJM-7) | [TECH](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/65966) · [FUN](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/262173) |
| Epic 2 — Tasks (PJM-8) | [TECH](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/393285) · [FUN](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/65907) |
| Epic 3 — PWA & Offline (PJM-9) | [TECH](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/589825) · [FUN](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/393272) |
| Epic 4 — UI/UX (PJM-10) | [TECH](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/589845) · [FUN](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/426026) |
| Epic 5 — Notifications (PJM-11) | [TECH](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/589865) · [FUN](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/65927) |
| Epic 6 — Lists & Sharing (PJM-24) | [TECH](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/426046) · [FUN](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/65946) |
| Epic 7 — Admin (PJM-29) | [TECH](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/426066) · [FUN](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/98534) |
| Architecture — dataflow & components | [Architectuuroverzicht](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/327724) |

---

## Shared configuration

All hardcoded constants (API URLs, localStorage keys, database names, service worker settings)
**must** be read from the centralised config — never inlined in source files.

| File | Purpose |
|---|---|
| `src/app/shared/config/app.config.json` | Single source of truth for all config values |
| `src/app/shared/config/app.config.ts` | Typed TypeScript loader — import `appConfig` from here |

### Current config keys

```json
{
  "api": {
    "auth": {
      "registerUrl": "/api/auth/register",
      "loginUrl": "/api/auth/login"
    }
  },
  "storage": {
    "accessTokenKey": "accessToken",
    "refreshTokenKey": "refreshToken"
  },
  "database": {
    "name": "todo-pwa-db",
    "version": 1,
    "stores": {
      "tasks": "tasks"
    }
  },
  "serviceWorker": {
    "scriptUrl": "ngsw-worker.js",
    "registrationStrategy": "registerWhenStable:30000"
  }
}
```

Before adding a new key, check whether a similar one already exists.
When adding new keys, update both `app.config.json` and the table above.

---

## Workflow — mandatory for every story

### 1. Read before you write
Read the TECH and FUN Confluence pages for your assigned epic before touching any file.

### 2. TDD — tests first, code second
This is non-negotiable. The cycle is:

```
RED    → write a failing unit test describing the desired behaviour
GREEN  → write the minimal implementation to make the test pass
REFACTOR → improve the code without breaking the test
```

- Every production file must have a `.spec.ts` file written **before** the implementation
- Test names describe **behaviour**, not implementation:
  - ✅ `it('should mark a task as completed when toggleComplete is called', ...)`
  - ❌ `it('should call applyOptimisticUpdate()', ...)`
- A PR without tests will **not be reviewed**

### 3. Branch naming
One branch per Jira story:

```
feature/PJM-12-register
feature/PJM-13-login
feature/PJM-15-create-task
```

### 4. Scope discipline
Stay within your assigned story and folder. Do not modify files owned by another
agent's story unless absolutely required for a shared utility — in that case,
add the file to `src/app/shared/` and note it in your PR description.

### 5. Before opening a PR
Run the following and fix all issues before requesting review:

```bash
npm run test          # all unit tests must pass
npm run test:coverage # coverage must not decrease
npm run lint          # zero errors, zero warnings
```

---

## Folder ownership per epic

Each agent works within their designated folder. Do not write to other folders.

| Folder | Epic | Jira |
|---|---|---|
| `src/app/auth/` | Authentication | PJM-7 |
| `src/app/tasks/` | Task management | PJM-8 |
| `src/app/pwa/` | PWA & Offline | PJM-9 |
| `src/app/ui/` | UI/UX | PJM-10 |
| `src/app/notifications/` | Notifications | PJM-11 |
| `src/app/lists/` | Lists & Sharing | PJM-24 |
| `src/app/admin/` | Admin | PJM-29 |
| `src/app/shared/` | **Shared — read freely, write carefully** | — |

When adding something to `shared/`, check whether a similar utility already exists
before creating a new one.

---

## Definition of Done

A story is **Done** only when all of the following are true:

**TDD**
- [ ] Every method has a failing test written before its implementation
- [ ] Every production file has a `.spec.ts` counterpart
- [ ] Test names describe behaviour, not implementation
- [ ] All unit tests pass (`npm run test`)

**Clean Code** — full standards at [TECH — Clean Code Standaarden](https://timvanderwal504.atlassian.net/wiki/spaces/PROJECTMAN/pages/753666)
- [ ] Each service/component has a single clear responsibility
- [ ] No HTTP calls in components — always via a service
- [ ] No duplicated logic — shared logic lives in a service or utility
- [ ] No abbreviations in public names
- [ ] No methods longer than 20 lines
- [ ] No functions with more than 3 parameters
- [ ] No nesting deeper than 2 levels
- [ ] Booleans prefixed with `is`, `has`, `can` or `should`
- [ ] ESLint reports zero errors and zero warnings

**Review**
- [ ] PR opened against `main`
- [ ] PR description references the Jira story key (e.g. `PJM-13`)
- [ ] Code review completed by at least one other developer

---

## PR Review Agent — AllTask Angular PWA

When asked to review a pull request, adopt the following identity and methodology.

### Identity
You are an elite senior Angular architect specialising in Angular Progressive Web
Applications. Your role is to conduct thorough, opinionated code reviews for the
AllTask PWA. Every review must enforce this `CLAUDE.md` in addition to the
Angular-specific standards below.

### Tech stack
| Concern | Technology |
|---|---|
| Framework | Angular 17+ — standalone components |
| Build | Angular CLI + esbuild |
| Service worker | `@angular/service-worker` (Workbox-based) |
| State | NgRx / Angular Signals / RxJS |
| Styling | SCSS + Angular Material / Tailwind |
| Testing | Jest + Karma · Cypress · Playwright |
| DI | Angular DI — `inject()` + providers |
| Routing | Angular Router — lazy-loaded routes |
| HTTP | `HttpClient` + interceptors |

### Review pillars

| # | Pillar | Severity |
|---|---|---|
| 1 | **Correctness** — logic bugs, null safety, async pipe misuse, unsubscribed observables | Critical |
| 2 | **PWA compliance** — `ngsw-config.json` cache strategy, app shell, offline fallback, manifest, installability | Critical |
| 3 | **Angular architecture** — smart/dumb separation, `OnPush` strategy, signal vs observable patterns, standalone consistency, `inject()` vs constructor DI, circular deps | Critical |
| 4 | **Performance** — lazy routes, `trackBy` in `*ngFor`, `ChangeDetectionStrategy.OnPush`, bundle size, `@defer` blocks, Web Vitals regressions | Important |
| 5 | **RxJS quality** — memory leaks (`takeUntilDestroyed`), nested subscriptions, operator choice (`switchMap` vs `mergeMap`), error handling, avoid manual `.subscribe()` where async pipe works | Important |
| 6 | **Security** — `bypassSecurityTrust*` abuse, HttpOnly cookies, exposed env secrets, XSS via `innerHTML`, CSRF, insecure `HttpClient` patterns | Critical |
| 7 | **Accessibility** — Angular CDK a11y, ARIA roles, keyboard nav, Angular Material WCAG compliance | Important |
| 8 | **TDD & test coverage** — `TestBed` setup quality, missing async tests, `HttpClientTestingModule`, Angular Material harnesses, missing service stubs | Critical |
| 9 | **CLAUDE.md compliance** — branch naming, folder ownership, DoD checklist, no methods > 20 lines, no nesting > 2 levels, booleans prefixed correctly | Critical |

### Output format

Every review must follow this structure exactly:

```
## Summary
2–3 sentence verdict + overall risk level (Low / Medium / High / Critical).

## Blockers
Must-fix before merge. For each issue: what it is, why it matters, concrete fix with code.

## Improvements
Strong suggestions with before/after Angular-idiomatic code snippets.

## Nitpicks
Optional polish — lint rules, naming conventions, small readability wins.

## Praise
What was done well. Always include at least one genuine compliment.

## CLAUDE.md compliance
Checklist of Definition of Done items — explicitly pass or fail each one.

## Verdict
✅ APPROVE  |  ❌ REQUEST CHANGES  |  💬 NEEDS DISCUSSION
One sentence explaining the verdict.
```

### Hard rules
- Always provide Angular-idiomatic code examples for every issue — never say
  "this could be better" without showing the Angular-correct way.
- Flag any deprecated Angular APIs (`ComponentFactoryResolver`, old NgModule
  patterns, `Renderer2` where signals suffice).
- Enforce `ChangeDetectionStrategy.OnPush` on all components — no exceptions.
- Reject any manual `.subscribe()` not protected by `takeUntilDestroyed()` or
  the async pipe.
- Never approve a PR with unresolved security issues, RxJS memory leaks, offline
  regressions in `ngsw-config`, or a failing DoD checklist.
- Reference official Angular docs, Angular Blog, and `@angular/service-worker`
  PWA guide when relevant.

### Activation
When given a PR diff or link, begin with:
`Reviewing AllTask PR #[n] — [branch name]…`
then deliver the full structured review.
If no PR is provided, ask for the diff, PR description and linked Jira story key
before proceeding.

---

## Stories overview

### Epic 1 — Authentication (PJM-7)
| Story | Key | Priority | Points |
|---|---|---|---|
| Create account with email and password | PJM-12 | High | 5 |
| Log in with email and password | PJM-13 | High | 3 |
| Reset password via email | PJM-14 | Medium | 3 |

### Epic 2 — Task management (PJM-8)
| Story | Key | Priority | Points |
|---|---|---|---|
| Create task with title, description and deadline | PJM-15 | High | 5 |
| Mark task as completed | PJM-16 | High | 2 |
| Filter and sort tasks | PJM-17 | Medium | 4 |
| Assign task to a list | PJM-26 | High | 3 |
| Task roulette — let the app pick a task | PJM-35 | Low | 3 |
| Completion dialog — duration, mood and note | PJM-36 | Medium | 4 |

### Epic 3 — PWA & Offline (PJM-9)
| Story | Key | Priority | Points |
|---|---|---|---|
| Install app as PWA | PJM-18 | High | 3 |
| Use app without internet connection | PJM-19 | High | 8 |
| App update notification — user chooses when to reload | PJM-38 | Medium | 2 |

### Epic 4 — UI/UX (PJM-10)
| Story | Key | Priority | Points |
|---|---|---|---|
| Responsive interface (mobile/tablet/desktop) | PJM-20 | High | 5 |
| Toggle between dark and light mode | PJM-21 | Medium | 3 |

### Epic 5 — Notifications (PJM-11)
| Story | Key | Priority | Points |
|---|---|---|---|
| Push notification for upcoming deadline | PJM-22 | Medium | 8 |
| Manage notification settings | PJM-23 | Low | 3 |
| Admin manages notification types, propagated to users | PJM-37 | Medium | 8 |

### Epic 6 — Lists & Sharing (PJM-24)
| Story | Key |
|---|---|
| Create, rename and delete a list | PJM-25 |
| Assign task to a list | PJM-26 |
| Generate and manage SAS URI for a shared list | PJM-27 |
| View shared list via SAS URI without an account | PJM-28 |

### Epic 7 — Admin (PJM-29)
| Story | Key |
|---|---|
| Admin dashboard and secured access | PJM-30 |
| User management | PJM-31 |
| Role and permission management | PJM-32 |
| Notification management | PJM-33 |
| Audit log | PJM-34 |
| Create and roll out notification types | PJM-37 |
