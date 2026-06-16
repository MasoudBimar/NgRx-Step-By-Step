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
