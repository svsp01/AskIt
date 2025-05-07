export interface Answer {
  _id: string;
  content: string;
  question: {
    _id: string;
    title: string;
  };
  voteCount: number;
  isAccepted: boolean;
  author?: {
    id: string;
    username: string;
    name?: string;
    avatarUrl?: string;
  };
}

export interface AnswerFormData {
  content: string;
}