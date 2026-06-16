# NgRx Fundamentals

- [NgRx Fundamentals](#ngrx-fundamentals)
  - [What Is Redux?](#what-is-redux)
  - [What Is NgRx?](#what-is-ngrx)
  - [Why Do We Need NgRx?](#why-do-we-need-ngrx)
  - [NgRx Mental Model](#ngrx-mental-model)
  - [Core Building Blocks](#core-building-blocks)
    - [State (Store)](#state-store)
    - [Actions](#actions)
    - [Reducers](#reducers)
    - [Selectors](#selectors)
    - [Effects](#effects)
  - [Key Concepts of NgRx](#key-concepts-of-ngrx)
  - [SHARI Principle](#shari-principle)
    - [Shared](#shared)
    - [Hydrated](#hydrated)
    - [Available](#available)
    - [Retrieved](#retrieved)
    - [Impacted](#impacted)
  - [When Not To Use NgRx](#when-not-to-use-ngrx)
  - [Example Feature Flow](#example-feature-flow)
  - [NgRx Responsibility Map](#ngrx-responsibility-map)
  - [Benefits Of NgRx](#benefits-of-ngrx)
  - [Costs Of NgRx](#costs-of-ngrx)
  - [Key Takeaways](#key-takeaways)


## What Is Redux?

Redux is a state management pattern for JavaScript applications. Its main idea is simple:

> Keep application state in one predictable place, change it only by dispatching actions, and calculate the next state with pure reducer functions.

Redux is built around three core ideas:

1. **Single source of truth**: important application state lives in one state tree.
2. **State is read-only**: components do not directly mutate shared state.
3. **Changes are made with pure functions**: reducers receive the current state and an action, then return the next state.

Redux became popular because it makes state changes easier to trace. Instead of asking "which component changed this value?", you can inspect the action that was dispatched and the reducer that handled it.

> [!NOTE]
> 3 principals of REDUX : `Store`, `Actions`, `Reducers`



## What Is NgRx?

NgRx is the Angular implementation of Redux-style reactive state management. It gives Angular applications a predictable way to manage state with RxJS, TypeScript, and Angular dependency injection.

NgRx is not only one package. It is a collection of libraries:

- **Store**: holds global application state.
- **Effects**: handles side effects such as HTTP calls, logging, navigation, and browser APIs.
- **Entity**: helps manage collections such as users, products, posts, or orders.
- **Router Store**: connects Angular Router state to the NgRx Store.
- **Store DevTools**: connects NgRx to Redux DevTools for debugging.

At the center of NgRx is the Store.

Uni-Directional data flow is a core principle of NgRx. The flow looks like this:

> [!NOTE]
>  View create User Event, Component Dispatch an action to a Dispatcher function called a Reducer, Reducer uses action and current state from store to create the new state (Immutable), component uses selector to get the state and be notified when its changed.

```text
Component -> dispatches Action -> Reducer updates State -> Selector reads State -> Component renders UI
```
> [!NOTE]
> effects are not part of the core flow. They are an optional extension for handling side effects. like HTTP calls, logging, or navigation.

For async work, Effects are added to the flow:

```text
Component -> dispatches Action -> Effect calls API -> Effect dispatches Success/Failure Action -> Reducer updates State
```

## Why Do We Need NgRx?

Angular already has components, services, dependency injection, RxJS, and signals. For small or local state, those tools are often enough.

Use local component state when the state belongs to one component only:

- a dropdown is open or closed
- a form input value
- a selected tab inside one component
- a loading spinner for one small UI section

Use a service when a small amount of state must be shared between a few related components.

NgRx becomes valuable when state is shared, long-lived, loaded from external sources, or modified by different parts of the application. It helps solve common problems:

- many components need the same data
- data must survive route changes
- multiple API calls update the same feature state
- loading, success, and error states need to be consistent
- business events need to be visible and traceable
- debugging requires knowing exactly what happened and when

NgRx gives structure to these problems. It separates responsibilities so components stay focused on the UI.

## NgRx Mental Model

Think of NgRx as an event-driven state machine.

- **State** is the current data.
- **Actions** describe what happened.
- **Reducers** decide how state changes.
- **Selectors** read and derive data from state.
- **Effects** run side effects and dispatch more actions.

Components should not know how the whole application state is built. They should dispatch meaningful actions and select the data they need.

## Core Building Blocks

### State (Store)

State is the data your application needs to remember.

  - View State
  - User Information
  - Entity Data
  - User Selection and Input

Example:

```ts
export interface CounterState {
  count: number;
  loading: boolean;
  error: string | null;
}

export const initialState: CounterState = {
  count: 0,
  loading: false,
  error: null,
};
```

Good state is explicit. If the UI needs to show loading or error information, that should usually be represented in state.

The Store is the Single Source of Truth and also Unshared state should not go in the Store.

### Actions

Actions describe events. They should be written as facts, not commands.

Action basic structure: 

```ts
  {
    type: 'LOGIN',
    payload: { username: 'Masoud', password:'expelliarmus'}
  }
```

Good action names:

```ts
export const incrementClicked = createAction('[Counter Page] Increment Clicked');
export const counterLoaded = createAction('[Counter API] Counter Loaded', props<{ count: number }>());
export const counterLoadFailed = createAction('[Counter API] Counter Load Failed', props<{ error: string }>());
```

Less useful action names:

```ts
export const setCount = createAction('[Counter] Set Count');
export const doApiCall = createAction('[Counter] Do API Call');
```

Actions should answer the question: **what happened?**

### Reducers

Reducers receive the current state and an action, then return the next state.

Reducers must be pure:

- no HTTP calls
- no router navigation
- no random values
- no date creation
- no direct mutation of the existing state object

Basic Reducer Example: 

```ts
  function reducer(state, action) {
    switch (action.type) {
      case 'LOAD_USER':
        return { users: [...state.users, action.payload]}
    }
  }

```

more general modern example:

```ts
export const counterReducer = createReducer(
  initialState,
  on(incrementClicked, (state) => ({
    ...state,
    count: state.count + 1,
  })),
  on(counterLoaded, (state, { count }) => ({
    ...state,
    count,
    loading: false,
    error: null,
  })),
  on(counterLoadFailed, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
```

Reducers answer the question: **how should the state change?**

### Selectors

Selectors read data from the Store. They can also derive new values from existing state.

Example:

```ts
export const selectCounterState = (state: AppState) => state.counter;

export const selectCount = createSelector(selectCounterState, (state) => state.count);

export const selectDoubleCount = createSelector(selectCount, (count) => count * 2);
```

Selectors keep components from depending on the internal shape of the Store. If state changes later, you update selectors instead of rewriting every component.

Selectors answer the question: **what data does the UI need?**

### Effects

Effects handle side effects. A side effect is work that reaches outside the reducer:

- HTTP requests
- browser storage
- router navigation
- timers
- logging
- WebSocket messages

Example:

```ts
export const loadCounter = createAction('[Counter Page] Load Counter');

export const loadCounter$ = createEffect(
  (actions$ = inject(Actions), api = inject(CounterApiService)) =>
    actions$.pipe(
      ofType(loadCounter),
      switchMap(() =>
        api.getCounter().pipe(
          map((count) => counterLoaded({ count })),
          catchError(() => of(counterLoadFailed({ error: 'Could not load counter.' }))),
        ),
      ),
    ),
  { functional: true },
);
```

Effects answer the question: **what external work should happen after this action?**

## Key Concepts of NgRx

**Type safety, immutability**, and unidirectional data flow are core concepts of NgRx.

**Encapsulation and separation of concerns** are also important.

**Serialization** of actions and state is a common practice for debugging and persistence.

**Testable code** is a key benefit of NgRx. Reducers and selectors are pure functions that can be easily tested. Effects can be tested with marble testing.

## SHARI Principle

NgRx should be used when the state has enough complexity to justify the extra structure. The NgRx documentation uses the **SHARI** principle as a guideline.

SHARI stands for:

| Letter | Meaning | Question |
| --- | --- | --- |
| S | Shared | Is the state used by multiple components or features? |
| H | Hydrated | Does the state need to be persisted and restored later? |
| A | Available | Does the state need to remain available across route changes? |
| R | Retrieved | Is the state retrieved through side effects such as HTTP calls? |
| I | Impacted | Can the state be changed by external actors or many sources? |

If a piece of state matches several SHARI points, NgRx is likely a good fit.

### Shared

State is shared when many components need the same source of truth.

Example:

- logged-in user profile
- selected organization
- shopping cart
- feature permissions

Without NgRx, this state can become duplicated across services and components.

### Hydrated

State is hydrated when it must be saved and restored.

Example:

- state restored from local storage
- state restored after refresh
- server-provided initial state
- previously selected filters

NgRx can make hydration explicit through actions and reducers.

### Available

State is available when it must survive route changes.

Example:

- user navigates from product list to product details and back
- filter state stays available across pages
- selected workspace remains active across the app

If route changes should not destroy the state, global store state may be appropriate.

### Retrieved

State is retrieved when it comes from side effects.

Example:

- API-loaded users
- backend permissions
- saved preferences
- search results

NgRx Effects provide a consistent place for this work.

### Impacted

State is impacted when many sources can change it.

Example:

- user actions
- API responses
- WebSocket updates
- route changes
- background refresh

When state can be changed from many directions, actions make those changes visible and traceable.

## When Not To Use NgRx

Do not put every value in NgRx.

NgRx is usually unnecessary for:

- local form state
- simple toggle values
- component-only UI state
- data used by one component
- state that does not need debugging, persistence, or cross-route access

Adding NgRx too early can make simple features harder to understand. A practical rule is:

> Start local. Move to services when sharing begins. Move to NgRx when SHARI makes the state important enough.

## Example Feature Flow

Imagine a products page.

The user opens the products page:

```ts
productsPageOpened();
```

An effect reacts to that action and calls the API:

```ts
loadProducts$ -> productsApi.getProducts()
```

The API succeeds:

```ts
productsLoaded({ products });
```

The reducer stores the products:

```ts
on(productsLoaded, (state, { products }) => ({
  ...state,
  products,
  loading: false,
}));
```

The component reads the products through selectors:

```ts
readonly products$ = this.store.select(selectProducts);
readonly loading$ = this.store.select(selectProductsLoading);
```

This gives the feature a predictable lifecycle:

1. Something happened.
2. An action described it.
3. An effect handled external work.
4. A reducer updated state.
5. A selector exposed state to the UI.

## NgRx Responsibility Map

| Part | Responsibility | Should Not Do |
| --- | --- | --- |
| Component | Display UI, dispatch actions, select data | Contain complex state rules |
| Action | Describe what happened | Mutate state |
| Reducer | Calculate next state | Call APIs or navigate |
| Selector | Read and derive state | Dispatch actions |
| Effect | Handle side effects | Directly mutate state |
| Service | Communicate with external systems | Own global UI state alone |

## Benefits Of NgRx

NgRx helps with:

- predictable state changes
- better debugging with Redux DevTools
- clear separation between UI and business events
- reusable selectors
- testable reducers and effects
- consistent handling of loading and error states
- easier reasoning in large Angular applications

## Costs Of NgRx

NgRx also has tradeoffs:

- more files
- more concepts
- more boilerplate than local state
- requires team discipline
- can be overused for simple state

The goal is not to use NgRx everywhere. The goal is to use it where the structure pays for itself.

## Key Takeaways

- Redux is a pattern for predictable state management.
- NgRx brings Redux-style state management to Angular.
- Actions describe events.
- Reducers update state in a pure way.
- Selectors read and derive data.
- Effects handle side effects.
- SHARI helps decide whether state belongs in NgRx.
- Local state, services, and NgRx all have a place in Angular applications.
