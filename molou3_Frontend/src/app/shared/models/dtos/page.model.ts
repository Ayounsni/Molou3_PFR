export interface PageDTO<T> {
    content: T[];
    pageNumber: number; 
    pageSize: number;   
    totalElements: number; 
    totalPages: number;   
    last: boolean;         
  }