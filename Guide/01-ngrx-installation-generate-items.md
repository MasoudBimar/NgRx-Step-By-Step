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

### Installing ngrx/store

```bash
# Store (reducers, selectors, dispatch, etc.)
ng add @ngrx/store@latest

```

### Adding effects

```bash
# Effects (async side effects: API calls, etc.)
ng add @ngrx/effects@latest

```

### Adding DevTools

```bash
# Store DevTools (Redux DevTools integration)
ng add @ngrx/store-devtools@latest

```

### For Router State in Store

```bash
# Router Store (keep Angular Router state in the Store)
ng add @ngrx/router-store@latest

```

### For using Normalized collection

```bash
# Entity (helper utilities for collections)
ng add @ngrx/entity@latest

```

## 2) Generate root store setup

Replace `src/app/app.config.ts` with your root config/module file if your setup is different.

```bash
 ng generate @ngrx/schematics:store AppState --root --module src/app/app.config.ts
```

## 3) Generate one full feature (recommended)

This is the fastest way to scaffold feature state with actions, reducer, selectors, and effects.

```bash
 ng generate feature products --group --creators
```

## 4) Generate each NgRx piece separately

Use this when you want full control over files.

```bash
ng generate action products
ng generate reducer products
ng generate selector products
ng generate effect products
ng generate entity products
```

## 5) Redux pattern mapping in NgRx

- `State` -> store state interfaces + initial state
- `Actions` -> action creators
- `Reducer` -> pure state transition functions
- `Selectors` -> read/query state
- `Effects` -> side effects (API calls, async workflows)
- `Store` -> central source of truth
