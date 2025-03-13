export interface PageDTO<T> {
    content: T[];
    pageNumber: number; // Numéro de la page actuelle (0-based)
    pageSize: number;   // Taille de la page
    totalElements: number; // Nombre total d'éléments
    totalPages: number;    // Nombre total de pages
    last: boolean;         // Indique si c'est la dernière page
  }