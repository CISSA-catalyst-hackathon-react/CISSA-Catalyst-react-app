export type Connection = {
  id: string;
  name: string;      // e.g. "family"
  postA: string;     // postId of one post
  postB: string;     // postId of the other post
};