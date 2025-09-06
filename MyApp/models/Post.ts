export interface Post {
  id: string;
  title: string;
  type: string;
  imageUri: string | null;       // Default or user-picked URI
  connections: string[];
  projectId: string;
}


