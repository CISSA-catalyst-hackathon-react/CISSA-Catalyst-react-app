import { Post } from './Post';
import { Connection } from './Connection';
export interface Project {
  id: string;
  name: string;
  imageUri: string | null;
  connections: Connection[];       // Default or user-picked URI
  posts: Post[];
}



