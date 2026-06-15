# Add NgRx to an Angular Web Application

- [Add NgRx to an Angular Web Application](#add-ngrx-to-an-angular-web-application)
  - [Prerequisites](#prerequisites)
  - [Install NgRx Packages](#install-ngrx-packages)
  - [What Each Command Does](#what-each-command-does)
    - [`ng add @ngrx/store@latest`](#ng-add-ngrxstorelatest)
    - [`ng add @ngrx/effects@latest`](#ng-add-ngrxeffectslatest)
    - [`ng add @ngrx/store-devtools@latest`](#ng-add-ngrxstore-devtoolslatest)
    - [`ng add @ngrx/router-store@latest`](#ng-add-ngrxrouter-storelatest)
    - [`ng add @ngrx/entity@latest`](#ng-add-ngrxentitylatest)
    - [`ng add @ngrx/schematics@latest`](#ng-add-ngrxschematicslatest)
  - [Root Configuration in a Standalone Angular App](#root-configuration-in-a-standalone-angular-app)
  - [Files Usually Added to the Angular Application](#files-usually-added-to-the-angular-application)
  - [Minimal Example: Counter State](#minimal-example-counter-state)
    - [1. Create Actions](#1-create-actions)
    - [2. Create a Reducer and Feature](#2-create-a-reducer-and-feature)
    - [3. Export the Feature](#3-export-the-feature)
    - [4. Register Feature State](#4-register-feature-state)
    - [5. Use Store in a Component](#5-use-store-in-a-component)
  - [Add Effects When Async Work Is Needed](#add-effects-when-async-work-is-needed)
  - [Generate NgRx Files with Schematics](#generate-ngrx-files-with-schematics)
  - [Verify the Installation](#verify-the-installation)
  - [Recommended First Steps](#recommended-first-steps)
  - [Install Redux Store DevTools](#install-redux-store-devtools)
    - [1. Install the Browser Extension](#1-install-the-browser-extension)
    - [2. Install the NgRx Devtools Package](#2-install-the-ngrx-devtools-package)
    - [3. Import `isDevMode` and `provideStoreDevtools`](#3-import-isdevmode-and-providestoredevtools)
    - [4. Add `provideStoreDevtools` to the Providers](#4-add-providestoredevtools-to-the-providers)
    - [5. Understand the Configuration Options](#5-understand-the-configuration-options)
    - [6. Run and Verify](#6-run-and-verify)
    - [7. Common Problems](#7-common-problems)


This guide shows how to install NgRx in a modern standalone Angular application and start using NgRx Store for state management.

NgRx is usually added in layers:

- `@ngrx/store` for the global state container, actions, reducers, and selectors.
- `@ngrx/effects` for async work such as HTTP calls.
- `@ngrx/store-devtools` for Redux DevTools debugging.
- `@ngrx/router-store` when route state should be available from the store.
- `@ngrx/entity` when you manage collections such as products, users, or orders.
- `@ngrx/schematics` when you want Angular CLI generators for NgRx files.

## Prerequisites

Start from an Angular application that already runs:

```bash
ng serve
```

If the project uses `pnpm`, `npm`, or `yarn`, Angular CLI will normally use the package manager configured for the project. This project uses `pnpm`.

## Install NgRx Packages

Run these commands from the Angular project root.

```bash
ng add @ngrx/store@latest
ng add @ngrx/effects@latest
ng add @ngrx/store-devtools@latest
ng add @ngrx/router-store@latest
ng add @ngrx/entity@latest
ng add @ngrx/schematics@latest
```

For this project, the installed runtime packages are:

```json
{
  "@ngrx/store": "^21.0.1",
  "@ngrx/effects": "^21.0.1",
  "@ngrx/store-devtools": "^21.0.1",
  "@ngrx/router-store": "^21.0.1",
  "@ngrx/entity": "^21.0.1"
}
```

The installed generator package is:

```json
{
  "@ngrx/schematics": "21.0.1"
}
```

## What Each Command Does

### `ng add @ngrx/store@latest`

Installs the core NgRx Store package.

It gives the app:

- `Store` service for dispatching actions and selecting state.
- `createAction`, `createActionGroup`, `props` for defining events.
- `createReducer`, `on` for changing state.
- `createSelector`, `createFeature`, `createFeatureSelector` for reading state.
- `provideStore` and `provideState` for standalone Angular configuration.

### `ng add @ngrx/effects@latest`

Installs NgRx Effects.

Effects are used for side effects:

- HTTP requests.
- Local storage writes.
- Timers.
- Router navigation.
- Dispatching follow-up success or failure actions.

Reducers must stay pure, so async work belongs in effects instead of reducers.

### `ng add @ngrx/store-devtools@latest`

Installs NgRx Store Devtools integration.

It connects NgRx to the Redux DevTools browser extension so you can inspect:

- Dispatched actions.
- Previous and next state.
- State diffs.
- Action history.
- Time-travel debugging.

### `ng add @ngrx/router-store@latest`

Installs Router Store.

Router Store synchronizes Angular Router navigation state into NgRx. Use it when selectors or effects need route information such as route params, query params, or the current URL.

### `ng add @ngrx/entity@latest`

Installs NgRx Entity.

Entity helps manage collections in normalized form:

```ts
{
  ids: ['1', '2'],
  entities: {
    '1': { id: '1', name: 'Angular' },
    '2': { id: '2', name: 'NgRx' }
  }
}
```

This avoids repetitive reducer code for common collection operations such as add, update, remove, and select all.

### `ng add @ngrx/schematics@latest`

Installs NgRx CLI generators.

After installing schematics, you can generate NgRx building blocks with commands such as:

```bash
ng generate @ngrx/schematics:action products
ng generate @ngrx/schematics:reducer products
ng generate @ngrx/schematics:effect products
ng generate @ngrx/schematics:feature products
```

## Root Configuration in a Standalone Angular App

Modern Angular applications usually configure app-level providers in `src/app/app.config.ts`.

After installing NgRx, the root configuration should include the NgRx providers:

```ts
// src/app/app.config.ts
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),

    provideStore(),
    provideEffects(),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
```

The important NgRx lines are:

```ts
provideStore()
provideEffects()
provideRouterStore()
provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
```

## Files Usually Added to the Angular Application

A small NgRx feature normally adds files like these:

```text
src/app/products-state/
  products.actions.ts
  products.reducer.ts
  products.selectors.ts
  products.effects.ts
  products.models.ts
  index.ts
```

The exact folder name can be different. Common alternatives are:

```text
src/app/store/
src/app/state/
src/app/products/store/
src/app/products-state/
```

Use the structure that matches the application. For learning projects, a feature folder such as `products-state` or `counter-state` is easy to follow.

## Minimal Example: Counter State

The smallest useful NgRx example is a counter. It has actions, reducer state, selectors, and component usage.

### 1. Create Actions

```ts
// src/app/counter-state/counter.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const CounterActions = createActionGroup({
  source: 'Counter',
  events: {
    Increment: emptyProps(),
    Decrement: emptyProps(),
    Reset: emptyProps(),
    'Set Count': props<{ count: number }>(),
  },
});
```

Actions describe what happened in the application. They should not contain state-changing logic.

### 2. Create a Reducer and Feature

```ts
// src/app/counter-state/counter.reducer.ts
import { createFeature, createReducer, on } from '@ngrx/store';

import { CounterActions } from './counter.actions';

export interface CounterState {
  count: number;
}

export const initialState: CounterState = {
  count: 0,
};

export const counterFeature = createFeature({
  name: 'counter',
  reducer: createReducer(
    initialState,
    on(CounterActions.increment, (state) => ({
      ...state,
      count: state.count + 1,
    })),
    on(CounterActions.decrement, (state) => ({
      ...state,
      count: state.count - 1,
    })),
    on(CounterActions.reset, () => initialState),
    on(CounterActions.setCount, (state, { count }) => ({
      ...state,
      count,
    })),
  ),
});

export const {
  name: counterFeatureKey,
  reducer: counterReducer,
  selectCount,
  selectCounterState,
} = counterFeature;
```

Reducers are pure functions. They receive the current state and an action, then return the next state.

### 3. Export the Feature

```ts
// src/app/counter-state/index.ts
export * from './counter.actions';
export * from './counter.reducer';
```

The `index.ts` file makes imports cleaner in other files.

### 4. Register Feature State

Register the feature in `app.config.ts` with `provideState`.

```ts
// src/app/app.config.ts
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { counterFeature } from './counter-state';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),

    provideStore(),
    provideState(counterFeature),
    provideEffects(),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
```

For lazy-loaded routes, feature state can also be registered at the route level:

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';

import { counterFeature } from './counter-state';

export const routes: Routes = [
  {
    path: 'counter',
    providers: [provideState(counterFeature)],
    loadComponent: () => import('./counter/counter').then((m) => m.Counter),
  },
];
```

Use root registration for state that is needed by the whole application. Use route-level registration for state that belongs to one lazy feature.

### 5. Use Store in a Component

```ts
// src/app/counter/counter.ts
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { CounterActions, selectCount } from '../counter-state';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.html',
})
export class Counter {
  private readonly store = inject(Store);

  readonly count$ = this.store.select(selectCount);

  increment(): void {
    this.store.dispatch(CounterActions.increment());
  }

  decrement(): void {
    this.store.dispatch(CounterActions.decrement());
  }

  reset(): void {
    this.store.dispatch(CounterActions.reset());
  }
}
```

```html
<!-- src/app/counter/counter.html -->
<section>
  <h2>Counter</h2>

  <p>Count: {{ count$ | async }}</p>

  <button type="button" (click)="decrement()">-</button>
  <button type="button" (click)="increment()">+</button>
  <button type="button" (click)="reset()">Reset</button>
</section>
```

## Add Effects When Async Work Is Needed

Install effects when actions need to trigger asynchronous work.

Example action file:

```ts
// src/app/products-state/products.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export interface Product {
  id: number;
  name: string;
}

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
  },
});
```

Example effects file:

```ts
// src/app/products-state/products.effects.ts
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { ProductsActions } from './products.actions';
import { ProductsApi } from './products-api';

export const loadProducts = createEffect(
  (actions$ = inject(Actions), productsApi = inject(ProductsApi)) => {
    return actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        productsApi.getProducts().pipe(
          map((products) => ProductsActions.loadProductsSuccess({ products })),
          catchError((error: unknown) =>
            of(ProductsActions.loadProductsFailure({ error: String(error) })),
          ),
        ),
      ),
    );
  },
  { functional: true },
);
```

Register functional effects like this:

```ts
// src/app/app.config.ts
import { provideEffects } from '@ngrx/effects';

import * as productsEffects from './products-state/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(productsEffects),
  ],
};
```

## Generate NgRx Files with Schematics

You can write NgRx files manually, or generate starter files.

Generate a full feature:

```bash
ng generate @ngrx/schematics:feature products --group
```

Generate files separately:

```bash
ng generate @ngrx/schematics:action products --group
ng generate @ngrx/schematics:reducer products --group
ng generate @ngrx/schematics:effect products --group
```

Depending on the schematic and options, Angular CLI may create or update files such as:

```text
src/app/products.actions.ts
src/app/products.reducer.ts
src/app/products.effects.ts
src/app/products.selectors.ts
src/app/products.reducer.spec.ts
src/app/products.effects.spec.ts
src/app/app.config.ts
package.json
pnpm-lock.yaml
```

Review generated code before committing. Schematics provide a useful starting point, but real applications usually need domain-specific action names, state names, and folder organization.

## Verify the Installation

After installing and configuring NgRx, run:

```bash
ng build
ng test
ng serve
```

Then open the app in the browser and check Redux DevTools. You should see dispatched NgRx actions and store state.

## Recommended First Steps

1. Install `@ngrx/store` and configure `provideStore()`.
2. Create one small feature state, such as `counter`.
3. Add actions, reducer, and selectors.
4. Register the feature with `provideState(counterFeature)`.
5. Dispatch actions from a component.
6. Select state from the component.
7. Add `@ngrx/store-devtools` for debugging.
8. Add `@ngrx/effects` only when async workflows are needed.
9. Add `@ngrx/entity` when the state contains collections.
10. Add `@ngrx/router-store` when route information should be part of store-driven logic.


## Install Redux Store DevTools

Redux DevTools is the browser extension used by NgRx Store Devtools. It lets you inspect every dispatched action and see how the store state changed after each action.

### 1. Install the Browser Extension

Install the Redux DevTools browser extension:

- Chrome: Redux DevTools extension from the Chrome Web Store.
- Edge: Redux DevTools extension from Microsoft Edge Add-ons.
- Firefox: Redux DevTools extension from Firefox Browser Add-ons.

After installing it, restart or refresh the Angular application tab.

### 2. Install the NgRx Devtools Package

Run this command from the Angular project root:

```bash
ng add @ngrx/store-devtools@latest
```

This command installs:

```json
{
  "@ngrx/store-devtools": "^21.0.1"
}
```

It may also update:

```text
package.json
pnpm-lock.yaml
src/app/app.config.ts
```

If the schematic does not update `app.config.ts`, add the configuration manually.

### 3. Import `isDevMode` and `provideStoreDevtools`

In a standalone Angular app, configure DevTools in `src/app/app.config.ts`.

```ts
// src/app/app.config.ts
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
```

The required DevTools imports are:

```ts
import { isDevMode } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';
```

### 4. Add `provideStoreDevtools` to the Providers

Add `provideStoreDevtools(...)` after `provideStore()`.

```ts
// src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),

    provideStore(),
    provideEffects(),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};
```

For this project, the shorter configuration is already enough:

```ts
provideStoreDevtools({
  maxAge: 25,
  logOnly: !isDevMode(),
})
```

### 5. Understand the Configuration Options

- `maxAge: 25` keeps the last 25 store states in the DevTools history.
- `logOnly: !isDevMode()` allows full DevTools behavior during development and restricts it in production builds.
- `autoPause: true` stops recording actions while the DevTools panel is closed.
- `trace: false` disables stack traces for dispatched actions. Set it to `true` only when you need to find where an action was dispatched.
- `traceLimit: 75` controls how many stack frames are kept when `trace` is enabled.
- `connectInZone: true` connects DevTools inside Angular's zone.

### 6. Run and Verify

Start the app:

```bash
ng serve
```

Open the browser and then open the Redux DevTools extension.

You should see:

- An NgRx store connection.
- Dispatched action names.
- The state before and after each action.
- State diffs for every action.

If the DevTools panel is empty, dispatch an action from the app. For example, click a button that calls:

```ts
this.store.dispatch(CounterActions.increment());
```

### 7. Common Problems

- No actions appear: make sure `provideStore()` is configured before using store state.
- DevTools cannot connect: refresh the browser tab after installing the extension.
- Production build only logs actions: this is expected when `logOnly: !isDevMode()` is used.
- Too much history is stored: lower `maxAge`.
- You need to find where an action was dispatched: temporarily set `trace: true`.
