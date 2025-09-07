import { Connection } from "./Connection";

export type Post = {
  id: string;
  title: string;
  type: string;
  notes?: string;
  imageUri: string | null;   // ✅ allow null
  projectId: string;
};


