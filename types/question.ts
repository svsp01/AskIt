export interface Question {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  voteCount: number;
  author?: {
    _id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
}

export interface QuestionFormData {
  title: string;
  content: string;
  tags: string[];
}