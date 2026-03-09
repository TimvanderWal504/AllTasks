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
