import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Association } from '../../shared/models/association.model';
import { Colombophile } from '../../shared/models/colombophile.model';
import { User } from '../../shared/models/user.model';

export interface AuthState {
  loading: boolean;
  error: string | null;
  registeredUser: Colombophile | Association | null;
  currentUser: User | null;
  token: string | null;
  loginLoading: boolean;
  loginError: string | null;
}

export const initialState: AuthState = {
  loading: false,
  error: null,
  registeredUser: null,
  currentUser: null,
  token: null,
  loginLoading: false,
  loginError: null
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
  on(AuthActions.resetRegistrationState, () => initialState),
  on(AuthActions.login, (state) => ({
    ...state,
    loginLoading: true,
    loginError: null
  })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    currentUser: user,
    token,
    loginLoading: false
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loginError: error,
    loginLoading: false
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    currentUser: null,
    token: null
  }))
);