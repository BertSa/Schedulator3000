package ca.bertsa.schedulator3000.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@AllArgsConstructor
public class ConnectionDto {
    @Email
    @NotBlank
    private final String email;
    @NotBlank
    private final String password;
}
