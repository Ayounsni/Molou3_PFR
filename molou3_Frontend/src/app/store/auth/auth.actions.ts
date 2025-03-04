import { createAction, props } from '@ngrx/store';
import { Association } from '../../shared/models/association.model';
import { Colombophile } from '../../shared/models/colombophile.model';

export const registerColombophile = createAction(
  '[Auth] Register Colombophile',
  props<{ data: any }>() // Remplace formData par data
);

export const registerAssociation = createAction(
  '[Auth] Register Association',
  props<{ data: any }>() // Remplace formData par data
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: Colombophile | Association }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: any }>()
);

export const resetRegistrationState = createAction('[Auth] Reset Registration State');