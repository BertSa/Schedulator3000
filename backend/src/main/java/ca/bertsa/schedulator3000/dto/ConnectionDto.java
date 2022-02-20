package ca.bertsa.schedulator3000.dto;

import lombok.Getter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
public class ConnectionDto {
    @Email
    @NotBlank
    private final String email;
    @NotBlank
    private final String password;

    public ConnectionDto(@Email @NotBlank String email, @NotBlank String password) {
        this.email = email;
        this.password = password;
    }
}
