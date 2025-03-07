import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleLabel',
  standalone: true
})
export class RoleLabelPipe implements PipeTransform {
  transform(roleName: string | undefined): string {
    if (!roleName) {
      return 'Rôle inconnu'; 
    }

    switch (roleName) {
      case 'ROLE_ADMIN':
        return 'Administrateur';
      case 'ROLE_ASSOCIATION':
        return 'Association';
      case 'ROLE_COLOMBOPHILE':
        return 'Colombophile';
      default:
        return roleName; 
    }
  }
}