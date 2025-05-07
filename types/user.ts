export interface User {
  _id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  createdAt: string;
  avatarUrl?: string;
}