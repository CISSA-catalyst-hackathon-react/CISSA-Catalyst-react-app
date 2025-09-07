
export type Post = {
  id: string;
  title: string;
  type: string;
  notes?: string;
  imageUri: string | null;   // ✅ allow null
  connections: string[];
  projectId: string;
};


