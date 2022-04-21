interface PasswordChange {
    currentPassword: string;
    newPassword: string;
}

export interface PasswordChangeDto extends PasswordChange {
    email?: string;
}

export interface PasswordChangeWithPwdConfirmation extends PasswordChange {
    confirmationPassword: string;
}
