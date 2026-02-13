import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Item } from '../models/item.model';

export const ItemActions = createActionGroup({
  source: 'Item/API',
  events: {
    'Load Items': props<{ items: Item[] }>(),
    'Add Item': props<{ item: Item }>(),
    'Upsert Item': props<{ item: Item }>(),
    'Add Items': props<{ items: Item[] }>(),
    'Upsert Items': props<{ items: Item[] }>(),
    'Update Item': props<{ item: Update<Item> }>(),
    'Update Items': props<{ items: Update<Item>[] }>(),
    'Delete Item': props<{ id: string }>(),
    'Delete Items': props<{ ids: string[] }>(),
    'Clear Items': emptyProps(),
  }
});
