import { Post } from './Post';

export interface Project {
  id: string;
  name: string;
  imageUri: string | null;       // Default or user-picked URI
  posts: Post[];
}



