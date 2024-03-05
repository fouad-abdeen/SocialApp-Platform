export class BaseResponse<T> {
  status!: 'success';
  data!: T;
}

export class UserResponse {
  id!: string;
  username!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  followers!: string[];
  followings!: string[];
  posts!: string[];
  bio!: string;
  avatar!: string;
  verified!: boolean;
}

export class UserSearch {
  id!: string;
  username!: string;
  firstName!: string;
  lastName!: string;
  avatar!: string;
}

export class Post {
  id!: string;
  user!: {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  content!: string;
  likes!: string[];
  comments!: string[];
  image!: string;
  createdAt!: string;
  updatedAt!: string;
}
