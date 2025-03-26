export interface Reaction {
  id: string;
  userId: string;
  postId: string;
  reaction: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  userId: string;
  reactions: Reaction[],
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    realName?: string | null;
    hashtag: string;
    avatarPhoto: string | null;
  };
  tags: {
    tag: {
      name: string;
    };
  }[];
}
