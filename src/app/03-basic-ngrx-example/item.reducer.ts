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
    { id: 1, name: 'Learn actions', desc: 'The Actions that you need to learn' },
    { id: 2, name: 'Read state with selectors', desc: 'You need to define selectors to get state partially' },
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


// ======================================================


// import { createReducer, on } from '@ngrx/store';
// import { increment, decrement, reset } from './counter.actions';

// export const initialState = 0;

// export const counterReducer = createReducer(
//   initialState,
//   on(increment, (state) => state + 1),
//   on(decrement, (state) => state - 1),
//   on(reset, () => 0)
// );
