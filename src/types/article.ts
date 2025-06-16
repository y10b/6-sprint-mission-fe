export interface Article {
  id: number;
  title: string;
  content: string;
  author?: string;
  authorImage?: string | null;
  images?: string;
  likes?: { length: number };
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  author?: string;
  authorImage?: string | null;
  createdAt: string;
}
