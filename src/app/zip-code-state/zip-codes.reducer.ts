import { createReducer, on } from '@ngrx/store';
import { ZipCodeActions } from './zip-code.actions';

export const zipCodesFeatureKey = 'zipCodes';

export type ZipCodeState = string[];


export const initialState: ZipCodeState = [];

export const zipCodeReducer = createReducer(
  initialState,
  on(ZipCodeActions.addZipCode, (state: ZipCodeState, action) => ([...state, action.zipcode])),
  on(ZipCodeActions.removeZipCode, (state: ZipCodeState, action) => state.filter(zipCode => zipCode !== action.zipcode)),
);
