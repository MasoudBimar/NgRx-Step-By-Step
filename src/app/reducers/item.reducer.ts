import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Item } from '../models/item.model';
import { ItemActions } from '../actions/item.actions';

export const itemsFeatureKey = 'items';

export interface ItemState extends EntityState<Item> {
  // additional entities state properties
  items: Item[];
}

export const adapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialState: ItemState = adapter.getInitialState({
  // additional entity state properties
  items: []
});

export const reducer = createReducer(
  initialState,
  on(ItemActions.addItem,
    (state, action) => adapter.addOne(action.item, state)
  ),
  on(ItemActions.upsertItem,
    (state, action) => adapter.upsertOne(action.item, state)
  ),
  on(ItemActions.addItems,
    (state, action) => adapter.addMany(action.items, state)
  ),
  on(ItemActions.upsertItems,
    (state, action) => adapter.upsertMany(action.items, state)
  ),
  on(ItemActions.updateItem,
    (state, action) => adapter.updateOne(action.item, state)
  ),
  on(ItemActions.updateItems,
    (state, action) => adapter.updateMany(action.items, state)
  ),
  on(ItemActions.deleteItem,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(ItemActions.deleteItems,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(ItemActions.loadItems,
    (state, action) => adapter.setAll(action.items, state)
  ),
  on(ItemActions.clearItems,
    state => adapter.removeAll(state)
  ),
);

export const itemsFeature = createFeature({
  name: itemsFeatureKey,
  reducer,
  extraSelectors: ({ selectItemsState }) => ({
    ...adapter.getSelectors(selectItemsState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = itemsFeature;
