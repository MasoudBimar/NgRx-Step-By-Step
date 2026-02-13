import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { zipCodeReducer, zipCodesFeatureKey, ZipCodeState } from './zip-codes.reducer';

export interface State {
  [zipCodesFeatureKey]: ZipCodeState;

}

export const reducers: ActionReducerMap<State> = {
  [zipCodesFeatureKey]: zipCodeReducer
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
