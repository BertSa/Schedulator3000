export interface PasswordChangeDto {
    email?: string;
    currentPassword: string;
    newPassword: string;
}

export type PasswordChangeWithPwdConfirmation = Omit<PasswordChangeDto, "email"> & {
    confirmationPassword: string;
}
