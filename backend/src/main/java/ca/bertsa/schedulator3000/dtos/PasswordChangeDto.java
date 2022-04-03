package ca.bertsa.schedulator3000.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeDto {
    private String email;
    private String currentPassword;
    private String newPassword;
}
