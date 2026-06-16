import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Item } from './item.model';

export const ItemActions = createActionGroup({
  source: 'Basic NgRx Item',
  events: {
    'Add Item': props<{ item: Item }>(),
    'Clear Items': emptyProps(),
  },
});
