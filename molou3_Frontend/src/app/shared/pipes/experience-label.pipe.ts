import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'experienceLabel',
  standalone: true
})
export class ExperienceLabelPipe implements PipeTransform {
  transform(niveauExperience: string |null| undefined): string {
    if (!niveauExperience) {
      return 'Niveau inconnu';
    }

    switch (niveauExperience.toUpperCase()) { 
      case 'BEGINNER':
        return 'Débutant';
      case 'INTERMEDIATE':
        return 'Intermédiaire';
      case 'EXPERT':
        return 'Expert';
      default:
        return niveauExperience; 
    }
  }
}