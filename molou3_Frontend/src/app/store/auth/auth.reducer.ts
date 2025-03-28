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
  changePasswordLoading: boolean; 
  changePasswordError: string | null; 
}

export const initialState: AuthState = {
  loading: false,
  error: null,
  registeredUser: null,
  currentUser: null,
  token: null,
  loginLoading: false,
  loginError: null,
  changePasswordLoading: false,
  changePasswordError: null
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
  })),
  on(AuthActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    currentUser: user,
  })),
  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(AuthActions.changePassword, (state) => ({
    ...state,
    changePasswordLoading: true,
    changePasswordError: null
  })),
  on(AuthActions.changePasswordSuccess, (state, { message }) => ({
    ...state,
    changePasswordLoading: false,
    changePasswordError: null
  })),
  on(AuthActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    changePasswordLoading: false,
    changePasswordError: error
  }))
);