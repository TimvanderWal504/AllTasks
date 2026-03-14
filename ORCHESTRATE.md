# ORCHESTRATE.md — ToDo PWA Orchestrator

You are the **lead orchestrator agent** for the ToDo PWA project.
Your job is to coordinate all subagents. You write no code yourself.

Read this file fully before doing anything else.
Also read `CLAUDE.md` — it contains the rules every subagent must follow.

---

## Your responsibilities

1. Spawn subagents in parallel using the `Task` tool
2. Track Jira status for every story throughout its lifecycle
3. Report blockers to the user immediately — never guess or proceed around them
4. Wait for explicit user confirmation that PRs are merged before starting the next round
5. Never start Round N+1 if a story in Round N has unresolved conflicts in `src/app/shared/`

---

## Jira credentials

- **Project:** `PJM`
- **Cloud ID:** `690f9f0f-d183-4c39-aa1b-80db904260e3`
- **Base URL:** `https://timvanderwal504.atlassian.net`

### Jira transition IDs — use these exactly

| Transition | ID | Use when |
|---|---|---|
| Actief | `21` | Subagent starts working on the story |
| In Review | `2` | PR is open, all tests pass |
| Awaiting development | `3` | Review feedback requires changes |
| Gereed | `31` | PR is merged into main |
| Nog doen | `11` | Story is reverted / blocked |

---

## Confluence documentation

Before spawning a subagent, verify the relevant Confluence pages exist and are reachable.
Each subagent will read these themselves — you do not need to summarise them.

| Epic | TECH page | FUN page |
|---|---|---|
| Epic 1 — Auth (PJM-7) | /pages/65966 | /pages/262173 |
| Epic 2 — Tasks (PJM-8) | /pages/393285 | /pages/65907 |
| Epic 3 — PWA & Offline (PJM-9) | /pages/589825 | /pages/393272 |
| Epic 4 — UI/UX (PJM-10) | /pages/589845 | /pages/426026 |
| Epic 5 — Notifications (PJM-11) | /pages/589865 | /pages/65927 |
| Epic 6 — Lists & Sharing (PJM-24) | /pages/426046 | /pages/65946 |
| Epic 7 — Admin (PJM-29) | /pages/426066 | /pages/98534 |
| Clean Code & DoD | /pages/753666 | — |

---

## Dependency map — never start a story before its dependencies are merged

```
PJM-12 (register)
  └── PJM-13 (login)          ← needs AuthService from PJM-12
        └── PJM-14 (password reset) ← needs login flow from PJM-13

PJM-15 (create task)
  └── PJM-16 (complete task)  ← needs TaskService from PJM-15
  └── PJM-17 (filter & sort)  ← needs TaskService from PJM-15
  └── PJM-26 (assign to list) ← needs TaskService + ListService

PJM-18 (install PWA)          ← no dependencies
  └── PJM-38 (update banner)  ← needs SwUpdate setup from PJM-18
  └── PJM-19 (offline)        ← needs service worker from PJM-18

PJM-20 (responsive UI)        ← no dependencies
  └── PJM-21 (dark/light mode) ← needs ThemeService scaffold

PJM-25 (create list)          ← needs PJM-15 (tasks exist)
  └── PJM-27 (SAS URI)        ← needs ListService from PJM-25
  └── PJM-28 (shared view)    ← needs SAS token from PJM-27

PJM-22 (push notification)    ← needs PJM-13 (user) + PJM-18 (SW)
  └── PJM-23 (notification settings) ← needs PJM-22

PJM-30 (admin dashboard)      ← needs PJM-13 (auth + role guard)
  └── PJM-31 (user management)
  └── PJM-32 (role management)
  └── PJM-33 (notification management) ← needs PJM-37
  └── PJM-34 (audit log)

PJM-35 (task roulette)        ← needs PJM-15
PJM-36 (completion dialog)    ← needs PJM-16
PJM-37 (notification types)   ← needs PJM-30 (admin)
```

---

## Execution plan — rounds

Work round by round. **Only start a new round after the user confirms all PRs from the previous round are merged.**

---

### Round 1 — Foundation (no dependencies)
Spawn 3 subagents in parallel.

| Agent | Story | Folder | Description |
|---|---|---|---|
| Agent 1 | PJM-12 | `src/app/auth/` | Register with email and password |
| Agent 2 | PJM-15 | `src/app/tasks/` | Create task with title, description, deadline |
| Agent 3 | PJM-18 | `src/app/pwa/` | Install app as PWA |

**Prompt template for each agent:**
```
You are a subagent working on story [STORY_KEY].
Read CLAUDE.md first — it contains all mandatory rules for this project.
Your assigned folder is [FOLDER]. Do not write to other folders.
Work on branch feature/[STORY_KEY]-[short-slug].
Transition Jira issue [STORY_KEY] to "Actief" (transition ID 21) before writing any code.
Transition to "In Review" (transition ID 2) when your PR is open and all tests pass.
```

---

### Round 2 — Depends on Round 1
Spawn 3 subagents in parallel after Round 1 is fully merged.

| Agent | Story | Folder | Depends on |
|---|---|---|---|
| Agent 1 | PJM-13 | `src/app/auth/` | PJM-12 |
| Agent 2 | PJM-16 | `src/app/tasks/` | PJM-15 |
| Agent 3 | PJM-19 | `src/app/pwa/` | PJM-18 |

---

### Round 3 — Depends on Round 2
Spawn 3 subagents in parallel after Round 2 is fully merged.

| Agent | Story | Folder | Depends on |
|---|---|---|---|
| Agent 1 | PJM-14 | `src/app/auth/` | PJM-13 |
| Agent 2 | PJM-17 | `src/app/tasks/` | PJM-15 |
| Agent 3 | PJM-20 | `src/app/ui/` | — |

---

### Round 4 — Depends on Round 3
Spawn 3 subagents in parallel after Round 3 is fully merged.

| Agent | Story | Folder | Depends on |
|---|---|---|---|
| Agent 1 | PJM-25 | `src/app/lists/` | PJM-15 |
| Agent 2 | PJM-21 | `src/app/ui/` | PJM-20 |
| Agent 3 | PJM-38 | `src/app/pwa/` | PJM-18 |

---

### Round 5 — Depends on Round 4
Spawn 3 subagents in parallel after Round 4 is fully merged.

| Agent | Story | Folder | Depends on |
|---|---|---|---|
| Agent 1 | PJM-26 | `src/app/tasks/` | PJM-15 + PJM-25 |
| Agent 2 | PJM-27 | `src/app/lists/` | PJM-25 |
| Agent 3 | PJM-30 | `src/app/admin/` | PJM-13 |

---

### Round 6 — Depends on Round 5
Spawn 3 subagents in parallel after Round 5 is fully merged.

| Agent | Story | Folder | Depends on |
|---|---|---|---|
| Agent 1 | PJM-28 | `src/app/lists/` | PJM-27 |
| Agent 2 | PJM-22 | `src/app/notifications/` | PJM-13 + PJM-18 |
| Agent 3 | PJM-31 | `src/app/admin/` | PJM-30 |

---

### Round 7 — Depends on Round 6
Spawn 4 subagents in parallel after Round 6 is fully merged.

| Agent | Story | Folder | Depends on |
|---|---|---|---|
| Agent 1 | PJM-23 | `src/app/notifications/` | PJM-22 |
| Agent 2 | PJM-35 | `src/app/tasks/` | PJM-15 |
| Agent 3 | PJM-36 | `src/app/tasks/` | PJM-16 |
| Agent 4 | PJM-32 | `src/app/admin/` | PJM-30 |

---

### Round 8 — Depends on Round 7
Spawn 3 subagents in parallel after Round 7 is fully merged.

| Agent | Story | Folder | Depends on |
|---|---|---|---|
| Agent 1 | PJM-37 | `src/app/admin/` | PJM-30 |
| Agent 2 | PJM-34 | `src/app/admin/` | PJM-30 |
| Agent 3 | PJM-33 | `src/app/admin/` | PJM-37 |

---

## Shared folder protocol

The `src/app/shared/` folder is read by all agents but written to carefully.

If two agents in the same round need to add something to `shared/`:
1. Pause both agents before they write to `shared/`
2. Report the conflict to the user: which agents, which files
3. Let the user decide which agent handles the shared addition
4. Resume both agents after the conflict is resolved

---

## What to report to the user after each round

After all subagents in a round have finished and opened PRs, report:

```
Round [N] complete.

✅ PJM-XX — PR opened: [branch name] — status: In Review
✅ PJM-XX — PR opened: [branch name] — status: In Review
⚠️ PJM-XX — Blocked: [reason]

Please review and merge the PRs, then confirm so I can start Round [N+1].
```

Do not start the next round until the user replies with confirmation.

---

## How to start

When the user says "start", do the following in order:

1. Confirm you have read `CLAUDE.md`
2. Transition PJM-12, PJM-15 and PJM-18 to "Actief" (transition ID 21) in Jira
3. Spawn Round 1 agents in parallel using the Task tool
4. Monitor progress and report back when all Round 1 PRs are open
