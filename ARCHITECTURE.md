# Architecture notes

## How it's structured

`Board` is the top-level component and the only real stateful container. It composes three hooks — `useTasks`, `useFilters`, `useToast` — and passes data and callbacks down. Everything below Board (Column, TaskCard, TaskForm, FilterBar) is presentational.

Board owns everything at the top. Under it: FilterBar, three Columns (each with N TaskCards), two Modals that both render a TaskForm (one for create, one for edit), and the Toast stack at the bottom.

I didn't reach for Zustand or Redux — the app isn't big enough to justify it. Three hooks and prop drilling to one level deep is fine here.

## Storage

Tasks are saved in localStorage as `{ version: 2, tasks: [...] }` under the key `workflow_tasks`.

The migration handles two old shapes: a bare array (very first version) and `{ version: 1, tasks: [...] }` where tasks had `dueDate` but no `assignee`, `tags`, or timestamps. `loadTasks()` returns `{ tasks, migrated }` and Board shows a toast if `migrated` is true.

To test the migration manually:
```js
localStorage.setItem("workflow_tasks", JSON.stringify([
  { id: "1", title: "Old task", description: "", status: "Backlog", priority: "High" }
]))
```
Then reload, the toast should appear.

## Filtering and URL sync

`useFilters` reads from the URL on mount (lazy `useState` initializer calling `readFromURL()`) so filters come back on refresh. Changes write back via `replaceState` so the browser history doesn't fill up.

This caused a real headache in tests — jsdom doesn't reset `window.location` between tests, so a test that searched for something would leave `?q=...` in the URL and the next test's `useFilters` would pick it up. The fix was adding `window.history.replaceState(null, "", "/")` to the `beforeEach` in the test setup file.

## Refactors

Started with tasks in a plain `useState` in Board seeded from mock data. Pulled it into `useTasks` once I needed localStorage, and updated the Task type at the same time — the first version was missing `assignee`, `tags`, `createdAt`, `updatedAt` so the form was incomplete.

The hook itself went through one more change. Initially:
```ts
const [{ tasks: initial }] = useState(() => loadTasks());
const [tasks, setTasks] = useState(initial);
```
The second `useState` didn't reliably pick up the initial value in tests. Replaced with a single combined state:
```ts
const [{ tasks, migrated }, setState] = useState<State>(() => {
  const r = loadTasks();
  return { tasks: r.tasks, migrated: r.migrated };
});
```

## Performance

`handleStatusChange` goes through Column down to every card, so it needs `useCallback` or every card re-renders on any state change. The create/update/delete handlers only go to the open modal so it matters less for those.

## Components

Plain CSS, one file per component in `src/components/ui/`. No Tailwind, no CSS-in-JS.

Modal has focus trapping (Tab cycles inside), ESC closes it, and it focuses the first input on open. The first version focused the first *focusable* element which ended up being the close button — typing in the form would instantly close the modal. Switched to prefer `input/textarea/select`.

All form inputs have associated labels. Badge takes a `variant` prop (`low`, `medium`, `high`, `tag`) rather than separate boolean props.

## What's missing

Drag and drop is the obvious one. Due dates would also be useful. If this were a real app I'd add a router so filter state survives navigation, and probably move storage to IndexedDB.
