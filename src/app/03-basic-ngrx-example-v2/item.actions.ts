import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Item } from './item.model';

export const ItemActions = createActionGroup({
  source: 'Basic NgRx Item',
  events: {
    'Add Item': props<{ item: Item }>(),
    'Clear Items': emptyProps(),
  },
});



// import { createAction } from '@ngrx/store';

// export const increment = createAction('[Counter Component] Increment');
// export const decrement = createAction('[Counter Component] Decrement');
// export const reset = createAction('[Counter Component] Reset');