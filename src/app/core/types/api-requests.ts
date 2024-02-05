export class LoginRequest {
  userIdentifier!: string;
  password!: string;
}

export class SignupRequest {
  username!: string;
  password!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
}
