import { Comment } from './api-response.type';

export interface CommentViewEvent {
  comment: Comment;
  action: 'view' | 'reply';
}
