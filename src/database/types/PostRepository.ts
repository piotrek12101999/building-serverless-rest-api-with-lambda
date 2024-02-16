import { Post } from "../../models/Post";

export interface PostRepository {
  create(post: Post): Promise<void>;
  findAll(): Promise<Post[]>;
}
