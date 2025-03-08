import { createAction, props } from '@ngrx/store';
import { Colombophile } from '../../shared/models/colombophile.model';
import { Association } from '../../shared/models/association.model';
import { User } from '../../shared/models/user.model';

export const registerColombophile = createAction(
  '[Auth] Register Colombophile',
  props<{ data: any; photo?: File }>()
);

export const registerAssociation = createAction(
  '[Auth] Register Association',
  props<{ data: any; preuveLegale: File; logo?: File }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: Colombophile | Association }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const checkLogin = createAction('[Auth] Check Login');

export const resetRegistrationState = createAction('[Auth] Reset Registration State');