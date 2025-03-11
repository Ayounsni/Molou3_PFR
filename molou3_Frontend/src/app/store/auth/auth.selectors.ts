import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { Association } from '../../shared/models/association.model';
import { Colombophile } from '../../shared/models/colombophile.model';
import { User } from '../../shared/models/user.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectRegisteredUser = createSelector(
  selectAuthState,
  (state) => state.registeredUser
);

export const selectLoginLoading = createSelector(
  selectAuthState,
  (state) => state.loginLoading
);

export const selectLoginError = createSelector(
  selectAuthState,
  (state) => state.loginError
);

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.currentUser as User | null
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

