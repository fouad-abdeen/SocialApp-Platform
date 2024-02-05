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
