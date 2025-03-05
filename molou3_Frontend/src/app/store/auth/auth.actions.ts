import { createAction, props } from '@ngrx/store';
import { Association } from '../../shared/models/association.model';
import { Colombophile } from '../../shared/models/colombophile.model';

export const registerColombophile = createAction(
  '[Auth] Register Colombophile',
  props<{ data: any }>()
);

export const registerAssociation = createAction(
  '[Auth] Register Association',
  props<{ data: any }>() 
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: Colombophile | Association }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: any }>()
);

export const login = createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>()
  );
  
export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ user: any; token: string }>()
  );
  
export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: any }>()
  );
  
export const logout = createAction('[Auth] Logout');

export const resetRegistrationState = createAction('[Auth] Reset Registration State');