# State Management Ingredients

State management helps your app stay predictable as it grows.  
In Angular + NgRx, the three core ingredients are:

1. `State`
2. `Actions`
3. `Redux pattern`

## 1) State

`State` is the single source of truth for your app data at a given moment.

> [!TIP]
> State is the single source of truth
>
> State is Read only

### State Notes

- Keep state minimal and serializable (plain objects, arrays, primitives).
- Store data, not UI behavior logic.
- Derive computed values with selectors instead of storing duplicates.
- Split state into feature slices (for example: `products`, `cart`, `auth`).
- Prefer immutable updates so changes are traceable and predictable.

## 2) Actions

`Actions` are plain objects that describe what happened in the app.

> [!TIP]
> Action is the only way to update state
>
> Action can have payload
>
> Actions are transitions between state

### Actions Notes

- Action names should be clear and event-focused, such as `[Cart] Item Added`.
- Include only the payload needed to process the event.
- Actions describe intent; they do not contain business logic.
- Any part of the app can dispatch actions (components, effects, services).
- Consistent action naming improves debugging and DevTools timelines.

## 3) Reducer

`Reducer` is a pure function that takes the current state and an action, and returns a new state.

### Reducer Notes

- Reducers must be pure: no side effects, no async work.
- Use switch statements or helper functions to handle different action types.
- Always return a new state object; never mutate the existing state.
- Combine reducers for different state slices using `combineReducers` or NgRx's `createReducer`.
- Reducers should be focused on state updates, not on how the UI reacts.

> [!TIP]
> Reducer is a pure function `(state, action) => newState`.
>
> Reducer returns new state object, never mutates existing state.
>
> Reducers perform synchronous updates only, no side effects.

```ts
export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case '[Cart] Item Added':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    default:
      return state;
  }
}
```

## 4) Redux Store

The `Redux Store` is the centralized place where the state lives. It provides methods to dispatch actions and select state.

> [!TIP]
> Store is in charge of holding state and dispatching actions.
>
> Store holds the current state and all the redicers.

## 5) Redux Pattern

The `Redux pattern` is a one-way data flow:

`UI -> dispatch action -> reducer updates state -> selectors expose state -> UI re-renders`

> [!TIP]
> Redux is the pattern
>
> NgRx is it's Angular Implemetation

### Redus Pattern Notes

- Reducers are pure functions: same input always produces same output.
- State is read-only from the UI perspective; updates happen only via actions.
- Side effects (API calls, async work) belong in effects, not reducers.
- Centralized flow makes bugs easier to reproduce and test.
- Time-travel and action history tools work well because updates are explicit.

## Quick Summary

- `State` = what the app currently knows.
- `Actions` = what happened.
- `Redux pattern` = how updates flow in a predictable, testable way.
