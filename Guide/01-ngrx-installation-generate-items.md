# NgRx Install and Generate Commands

Use these commands to install NgRx and generate all Redux-pattern pieces for state management.

## 1) Install NgRx packages

```bash
ng add @ngrx/store@latest
ng add @ngrx/effects@latest
ng add @ngrx/entity@latest
ng add @ngrx/router-store@latest
ng add @ngrx/store-devtools@latest
ng add @ngrx/schematics@latest
```

### `@ngrx/store`

- Core state container (Redux-style): holds app state and runs reducers.
- Use it to `dispatch` actions and `select` state in components/services.

```bash
# Store (reducers, selectors, dispatch, etc.)
ng add @ngrx/store@latest
```

### `@ngrx/effects`

- Handles side effects like API calls, timers, and async workflows.
- Keeps reducers pure by moving async logic out of reducers/components.

```bash
ng add @ngrx/effects@latest
```

### `@ngrx/entity`

- Provides adapters/utilities for managing collection data (lists/dictionaries).
- Reduces boilerplate for CRUD updates with helpers like `addOne`, `updateOne`.

```bash
ng add @ngrx/entity@latest
```

### `@ngrx/router-store`

- Syncs Angular Router state into the NgRx store.
- Useful for route-based selectors and debugging navigation changes.

```bash
ng add @ngrx/router-store@latest
```

### `@ngrx/store-devtools`

- Integrates with Redux DevTools extension for action/state inspection.
- Useful for debugging: action history, state diffs, and time travel.

```bash
ng add @ngrx/store-devtools@latest
```

### `@ngrx/schematics`

- Adds code generators for NgRx files (`action`, `reducer`, `effect`, `selector`, `feature`).
- Speeds up setup and keeps structure consistent across features.

```bash
ng add @ngrx/schematics@latest
```

## 2) Generate root store setup

Replace `src/app/app.config.ts` with your root config/module file if your setup is different.

```bash
 ng generate @ngrx/schematics:store AppState --root --module src/app/app.config.ts
```

## 3) Generate one full feature (recommended)

This is the fastest way to scaffold feature state with actions, reducer, selectors, and effects.

```bash
 ng generate feature product --group
```

> [!NOTE]
> `--group` Goal: Organize generated files into subfolders instead of dumping them all in one directory.

With `--group`, the schematic nests by file type, e.g.:

```bash
items/
actions/
effects/
reducers/
selectors/
```

## 4) Generate each NgRx piece separately

Use this when you want full control over files.

> [!CAUTION]
> If you run `ng generate feature ...` without the `@ngrx/schematics:` prefix, it only works if `@ngrx/schematics` is installed and registered so the CLI can resolve feature.
>
> Otherwise you’ll need the fully-qualified form 'ng generate @ngrx/schematics:feature'.

```bash
ng generate action item
ng generate reducer item
ng generate selector item
ng generate effect item
ng generate entity item
```

## 5) Redux pattern mapping in NgRx

- `State` -> store state interfaces + initial state
- `Actions` -> action creators
- `Reducer` -> pure state transition functions
- `Selectors` -> read/query state
- `Effects` -> side effects (API calls, async workflows)
- `Store` -> central source of truth
