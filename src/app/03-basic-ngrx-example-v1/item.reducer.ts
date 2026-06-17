import { ADD_ITEM, CLEAR_ITEMS } from './item.actions';
import { Item } from './item.model';

export const basicItemsFeatureKeyV1 = 'basicItems';

export interface BasicItemsState {
  items: Item[];
  nextId: number;
}

export const initialState = {
  items: [
    { id: 1, name: 'Learn actions', desc: 'The Actions that you need to learn' },
    { id: 2, name: 'Read state with selectors', desc: 'You need to define selectors to get state partially' },
  ],
  nextId: 3,
};

export function basicItemsReducerV1(state: BasicItemsState = initialState, action: any) {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
        nextId: Math.max(state.nextId, action.payload.id + 1),
      };

    case CLEAR_ITEMS:
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
}

export const selectItems = (state: any) => state?.['basicItemV1']?.items ?? [];
export const selectNextId = (state: any) => state?.['basicItemV1']?.nextId ?? 1;
export const selectItemsCount = (state: BasicItemsState) => selectItems(state).length;
export const selectLastAddedItemName = (state: BasicItemsState) => selectItems(state).at(-1)?.name ?? 'No items yet';

