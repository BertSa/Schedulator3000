interface PasswordChange {
    currentPassword: string;
    newPassword: string;
}

export interface PasswordChangeDto extends PasswordChange {
    email?: string;
}

export interface PasswordChangeFieldValues extends PasswordChange {
    confirmationPassword: string;
}
