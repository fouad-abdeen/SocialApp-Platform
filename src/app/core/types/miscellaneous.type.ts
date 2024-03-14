import { Comment } from './api-response.type';

export interface CommentViewEvent {
  comment: Comment;
  action: 'view' | 'reply';
}

export interface Profile {
  firstName: string;
  lastName: string;
  bio: string;
}
