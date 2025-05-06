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
  