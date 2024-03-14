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

export class ProfileEditRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export class UpdatePasswordRequest {
  currentPassword!: string;
  newPassword!: string;
  terminateAllSessions!: boolean;
}
