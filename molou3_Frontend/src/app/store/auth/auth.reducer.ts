import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Association } from '../../shared/models/association.model';
import { Colombophile } from '../../shared/models/colombophile.model';

export interface AuthState {
  loading: boolean;
  error: any;
  registeredUser: Colombophile | Association | null;
}

export const initialState: AuthState = {
  loading: false,
  error: null,
  registeredUser: null
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.registerColombophile,
    AuthActions.registerAssociation,
    (state) => ({ ...state, loading: true, error: null })
  ),
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    registeredUser: user
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.resetRegistrationState, () => initialState)
);