import { createActionGroup, props } from '@ngrx/store';

export const ZipCodeActions = createActionGroup({
  source: 'ZipCode',
  events: {
    'Add ZipCode': props<{ zipcode: string }>(),
    'Remove ZipCode': props<{ zipcode: string }>(),

  }
});
