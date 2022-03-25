package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dtos.EmployeeDto;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
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
    private Boolean active = null;
    @ManyToOne(fetch = FetchType.LAZY)
    private Manager manager;


    public EmployeeDto mapToDto() {
        EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setId(this.getId());
        employeeDto.setFirstName(this.getFirstName());
        employeeDto.setLastName(this.getLastName());
        employeeDto.setRole(this.getRole());
        employeeDto.setActive(this.getActive());
        return employeeDto;
    }
}
