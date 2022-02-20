package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dto.EmployeeDto;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class Employee extends User {

    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String role;
    private boolean active = true;



}
