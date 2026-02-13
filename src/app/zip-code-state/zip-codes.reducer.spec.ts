import { Action } from '@ngrx/store';
import { zipCodeReducer, initialState } from './zip-codes.reducer';

describe('ZipCodes Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = zipCodeReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
