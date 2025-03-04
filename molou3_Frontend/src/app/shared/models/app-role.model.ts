import { AppUser } from './app-user.model';

export interface AppRole {
  id?: number;
  roleName: string;
  users?: AppUser[];
}