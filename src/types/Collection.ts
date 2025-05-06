export interface Collection {
    id: string;
    name: string;
    previewImageUrl: string | null;
    userId: string;
    postCount: number;
    user: {
      name: string;
      hashtag: string | null;
      realName?: string | null;
    };
  }
  