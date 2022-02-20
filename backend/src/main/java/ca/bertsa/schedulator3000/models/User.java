package ca.bertsa.schedulator3000.models;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
@MappedSuperclass
@EqualsAndHashCode
public abstract class User {

    @Id
    @GeneratedValue
    private Long id;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String phone;
}
