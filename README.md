# Team Workflow Board

React + TypeScript task board. Backlog / In Progress / Done columns, everything in localStorage, no backend.

## Setup

```bash
cd frontend
npm install
npm run dev
```

`npm test` for tests, `npm run build` to build.

## What it does

Three columns, tasks as cards. Cards have title, priority badge, assignee, tags, and a relative timestamp. You can move a task between columns with the inline select on the card or open the edit modal and change the status there.

Filters (search, status, priority) and sort order are in the URL query string, so the same view comes back on refresh. The filter bar is at the top of the board.

Tasks are saved in localStorage under `workflow_tasks`. There's a schema version in there — if it finds v1 data (old format, no assignee/tags/timestamps) it migrates it automatically and shows a toast.

## Project layout

```
frontend/src/
  types/       Task, TaskStatus, TaskPriority
  hooks/       useTasks, useFilters, useToast
  utils/       storage.ts, relativeTime.ts
  components/
    ui/        Button, Card, Modal, TextInput, TextArea, Select, Badge, Toast
    board/     Column, FilterBar
    task/      TaskCard, TaskForm
    layout/    Board
  __tests__/
```

See ARCHITECTURE.md for how it fits together.

## Known issues / shortcuts

No drag and drop — the inline select works fine for now but I'd add `@dnd-kit` if this were going further. There's also no router so filter state clears if you navigate away (it survives refresh though, just not navigation). Assignee is free text, no real identity. If localStorage runs out of space the save quietly fails with a console warning.

## AI assistance

I used Claude Code while building this. It drafted the initial components and hooks, and the test files.

Things I caught and fixed: the `useTasks` hook had a nested useState pattern that broke in tests (second state wasn't getting the right initial value), rewrote it as one combined state object. The modal was focusing the close button on open instead of the first form field, which made typing tests fail in a confusing way. There were comments on basically every line explaining obvious things, removed most of them. CSS was all defaults, adjusted sizing and spacing throughout.
