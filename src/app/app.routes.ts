import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { basicItemsFeature } from './03-basic-ngrx-example-v2/item.reducer';
import { basicItemsReducerV1 } from './03-basic-ngrx-example-v1/item.reducer';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'v1',
    pathMatch: 'full',
  },
  {
    path: 'v1',
    loadComponent: () =>
      import('./03-basic-ngrx-example-v1/basic-ngrx-example').then((m) => m.BasicNgrxExample),
    providers: [provideState({name: 'basicItemV1', reducer: basicItemsReducerV1})],
  },
  {
    path: 'v2',
    loadComponent: () =>
      import('./03-basic-ngrx-example-v2/basic-ngrx-example').then((m) => m.BasicNgrxExample),
    providers: [provideState(basicItemsFeature)],
  },
];
