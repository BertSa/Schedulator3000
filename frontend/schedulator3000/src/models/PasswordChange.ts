interface IPasswordChange {
  currentPassword: string;
  newPassword: string;
}

export interface IPasswordChangeDto extends IPasswordChange {
  email?: string;
}

export interface IPasswordChangeFieldValues extends IPasswordChange {
  confirmationPassword: string;
}
