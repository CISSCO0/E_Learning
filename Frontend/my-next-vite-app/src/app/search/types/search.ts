export type SearchResultType =  'instructor' | 'student' | 'course' | 'user';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
}
export interface Course {
  _id: string
  title: string
  description: string
}
export interface User {
  _id: string;
  name: string;
  role: string; // Role should be '2' for instructor or '3' for student
}