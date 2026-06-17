# Basic NgRx Example State Management Structure

- [Basic NgRx Example State Management Structure](#basic-ngrx-example-state-management-structure)
  - [Purpose](#purpose)
  - [Folder Structure](#folder-structure)
  - [State Management Flow](#state-management-flow)
  - [1. Model](#1-model)
  - [2. Actions](#2-actions)
  - [3. State, Reducer, Feature, and Selectors](#3-state-reducer-feature-and-selectors)
  - [4. Register the Feature State](#4-register-the-feature-state)
  - [5. Use the Store in the Component](#5-use-the-store-in-the-component)
  - [6. Bind Store Data in the Template](#6-bind-store-data-in-the-template)
  - [Required Parts for Basic State Management](#required-parts-for-basic-state-management)
  - [How to Analyze This Structure](#how-to-analyze-this-structure)
  - [Key Takeaways](#key-takeaways)

## Purpose

The `03-basic-ngrx-example` directory shows a small NgRx feature for managing a list of items.

It demonstrates the basic state management parts:

- a model that defines the data shape
- actions that describe user events
- a reducer that creates the next state
- a feature definition that registers the state slice
- selectors that read and derive state
- a component that selects state and dispatches actions
- a template that renders observable state with `async`

The feature state is named `basicItems`.

## Folder Structure

```text
src/app/03-basic-ngrx-example/
  basic-ngrx-example.css
  basic-ngrx-example.html
  basic-ngrx-example.md
  basic-ngrx-example.ts
  item.actions.ts
  item.model.ts
  item.reducer.ts
```

| File | Responsibility |
| --- | --- |
| `item.model.ts` | Defines the `Item` interface used by the state. |
| `item.actions.ts` | Defines the events that can change item state. |
| `item.reducer.ts` | Defines the feature state, initial state, reducer, feature, and selectors. |
| `basic-ngrx-example.ts` | Connects the Angular component to the NgRx Store. |
| `basic-ngrx-example.html` | Displays selected state and dispatches actions through user events. |
| `basic-ngrx-example.css` | Styles the example UI. |

## State Management Flow

The example follows the standard NgRx unidirectional flow:

```text
Template event
  -> Component method
  -> Store dispatches action
  -> Reducer returns next state
  -> Selectors read state
  -> Component exposes observable data
  -> Template renders with async pipe
```

For example, adding an item works like this:

```text
User submits form
  -> addItem()
  -> ItemActions.addItem({ item })
  -> basicItemsReducer adds the item
  -> selectItems/selectItemsCount/selectLastAddedItemName emit new values
  -> template updates
```

## 1. Model

The model defines the shape of one item in the feature.

```ts
// src/app/03-basic-ngrx-example/item.model.ts
export interface Item {
  id: number;
  name: string;
}
```

This keeps the state, actions, reducer, and component aligned on the same data contract.

## 2. Actions

Actions describe what happened. They do not change state directly.

```ts
// src/app/03-basic-ngrx-example/item.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Item } from './item.model';

export const ItemActions = createActionGroup({
  source: 'Basic NgRx Item',
  events: {
    'Add Item': props<{ item: Item }>(),
    'Clear Items': emptyProps(),
  },
});
```

This action group creates two action creators:

```ts
ItemActions.addItem({ item })
ItemActions.clearItems()
```

Use `props` when an action needs payload data. Use `emptyProps` when no payload is required.

## 3. State, Reducer, Feature, and Selectors

The reducer file contains most of the NgRx feature structure.

```ts
// src/app/03-basic-ngrx-example/item.reducer.ts
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { ItemActions } from './item.actions';
import { Item } from './item.model';

export const basicItemsFeatureKey = 'basicItems';

export interface BasicItemsState {
  items: Item[];
  nextId: number;
}

export const initialState: BasicItemsState = {
  items: [
    { id: 1, name: 'Learn actions' },
    { id: 2, name: 'Read state with selectors' },
  ],
  nextId: 3,
};

export const basicItemsReducer = createReducer(
  initialState,
  on(ItemActions.addItem, (state, { item }) => ({
    ...state,
    items: [...state.items, item],
    nextId: Math.max(state.nextId, item.id + 1),
  })),
  on(ItemActions.clearItems, (state) => ({
    ...state,
    items: [],
  })),
);

export const basicItemsFeature = createFeature({
  name: basicItemsFeatureKey,
  reducer: basicItemsReducer,
});

export const { selectBasicItemsState, selectItems, selectNextId } = basicItemsFeature;

export const selectItemsCount = createSelector(selectItems, (items) => items.length);

export const selectLastAddedItemName = createSelector(
  selectItems,
  (items) => items.at(-1)?.name ?? 'No items yet',
);
```

Important sections:

| Section | Purpose |
| --- | --- |
| `basicItemsFeatureKey` | The name of this feature state slice in the Store. |
| `BasicItemsState` | The TypeScript shape of the feature state. |
| `initialState` | The starting state before any user action. |
| `basicItemsReducer` | The pure function that responds to actions. |
| `basicItemsFeature` | Connects the feature name and reducer together. |
| `selectItems`, `selectNextId` | Generated selectors from `createFeature`. |
| `selectItemsCount`, `selectLastAddedItemName` | Custom derived selectors. |

Reducers must return new state objects instead of mutating the existing state. That is why the example uses object and array spread:

```ts
{
  ...state,
  items: [...state.items, item],
}
```

## 4. Register the Feature State

The app root provides NgRx Store in `app.config.ts`.

```ts
// src/app/app.config.ts
import { provideStore } from '@ngrx/store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
  ],
};
```

The `basicItems` feature is registered at the route level with `provideState`.

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';

import { basicItemsFeature } from './03-basic-ngrx-example/item.reducer';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./03-basic-ngrx-example/basic-ngrx-example').then((m) => m.BasicNgrxExample),
    providers: [provideState(basicItemsFeature)],
  },
];
```

This means the feature state is available when this route is active.

## 5. Use the Store in the Component

The component injects `Store`, selects state as observables, and dispatches actions from methods.

```ts
// src/app/03-basic-ngrx-example/basic-ngrx-example.ts
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

import { ItemActions } from './item.actions';
import { selectItems, selectItemsCount, selectLastAddedItemName, selectNextId } from './item.reducer';

@Component({
  selector: 'app-basic-ngrx-example',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './basic-ngrx-example.html',
  styleUrl: './basic-ngrx-example.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicNgrxExample {
  private readonly store = inject(Store);

  protected readonly items$ = this.store.select(selectItems);
  protected readonly itemsCount$ = this.store.select(selectItemsCount);
  protected readonly lastAddedItemName$ = this.store.select(selectLastAddedItemName);

  protected itemName = '';

  addItem(): void {
    const name = this.itemName.trim();

    if (!name) {
      return;
    }

    this.store
      .select(selectNextId)
      .pipe(take(1))
      .subscribe((id) => {
        this.store.dispatch(ItemActions.addItem({ item: { id, name } }));
      });

    this.itemName = '';
  }

  clearItems(): void {
    this.store.dispatch(ItemActions.clearItems());
  }
}
```

Important component responsibilities:

- `store.select(...)` reads data from the Store.
- `store.dispatch(...)` sends actions to the Store.
- `take(1)` reads the next id once, then completes the subscription.
- `itemName` stays as local component form state because it is only needed by this component.

## 6. Bind Store Data in the Template

The template uses Angular event binding and the `async` pipe to connect the UI to the component.

```html
<!-- src/app/03-basic-ngrx-example/basic-ngrx-example.html -->
<form class="item-form" (ngSubmit)="addItem()">
  <label for="itemName">Item name</label>
  <div class="form-row">
    <input
      id="itemName"
      name="itemName"
      type="text"
      [(ngModel)]="itemName"
      placeholder="Add a new item"
      autocomplete="off"
    />
    <button type="submit">Add</button>
    <button type="button" class="secondary" (click)="clearItems()">Clear</button>
  </div>
</form>

<dl class="state-summary">
  <div>
    <dt>Total</dt>
    <dd>{{ itemsCount$ | async }}</dd>
  </div>
  <div>
    <dt>Last item</dt>
    <dd>{{ lastAddedItemName$ | async }}</dd>
  </div>
</dl>

<ul class="item-list" aria-label="Items">
  @for (item of items$ | async; track item.id) {
    <li>
      <span class="item-id">#{{ item.id }}</span>
      <span>{{ item.name }}</span>
    </li>
  } @empty {
    <li class="empty">No items in state.</li>
  }
</ul>
```

Important template responsibilities:

- `(ngSubmit)="addItem()"` dispatches the add flow through the component.
- `(click)="clearItems()"` dispatches the clear flow through the component.
- `[(ngModel)]="itemName"` keeps the input value in local component state.
- `items$ | async` subscribes to Store data and updates the UI.
- `@for (...; track item.id)` renders the item collection efficiently.
- `@empty` shows fallback UI when the selected item array is empty.

## Required Parts for Basic State Management

A minimal NgRx feature needs these parts:

```text
1. Model
   Defines the shape of the data.

2. Actions
   Describe the events that can happen.

3. State interface and initial state
   Define what the feature stores and its default value.

4. Reducer
   Calculates the next state for each action.

5. Feature registration
   Gives the reducer a feature name and registers it with the Store.

6. Selectors
   Read and derive state for components.

7. Component Store usage
   Selects state and dispatches actions.

8. Template bindings
   Displays selected state and calls component methods.
```

## How to Analyze This Structure

When reading an NgRx feature, follow this order:

1. Start with the model to understand the data.
2. Read the state interface and initial state to understand what the Store owns.
3. Read the actions to understand what events can change the state.
4. Read the reducer to understand how each event changes the state.
5. Read the selectors to understand what data the UI can consume.
6. Find `provideState(...)` to understand where the feature becomes available.
7. Read the component to see where actions are dispatched and selectors are used.
8. Read the template to see which user interactions start the flow.

For this example, the full loop is:

```ts
// User input becomes an action payload.
this.store.dispatch(ItemActions.addItem({ item: { id, name } }));

// The reducer creates the next state.
on(ItemActions.addItem, (state, { item }) => ({
  ...state,
  items: [...state.items, item],
  nextId: Math.max(state.nextId, item.id + 1),
}));

// Selectors expose the updated values.
protected readonly items$ = this.store.select(selectItems);
protected readonly itemsCount$ = this.store.select(selectItemsCount);

// The template renders the selected values.
@for (item of items$ | async; track item.id) {
  <li>{{ item.name }}</li>
}
```

## Key Takeaways

- Components do not mutate NgRx state directly.
- Components dispatch actions when users do something.
- Reducers decide how state changes.
- Selectors keep components decoupled from the raw state shape.
- `createFeature` creates useful selectors for the feature state.
- `provideState(basicItemsFeature)` makes the feature reducer available to the Store.
- Form input state can stay local when it does not need to be shared.
