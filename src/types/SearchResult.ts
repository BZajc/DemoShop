import { User } from "./User";
import { Collection } from "./Collection";
import { Tag } from "./Tag";

export interface SearchPost {
  id: string;
  title: string;
  imageUrl: string;
  rating: number;
  user: {
    name: string;
    hashtag: string | null;
  };
}

export interface SearchResult {
  posts: SearchPost[];
  collections: Collection[];
  users: User[];
  tags: Tag[];
  totalPosts: number;
  totalCollections: number;
  totalUsers: number;
}
