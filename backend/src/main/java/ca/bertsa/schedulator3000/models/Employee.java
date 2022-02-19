package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dto.EmployeeDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;

@Entity
@Getter
@Setter
public class Employee extends User {

    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String title;
    private boolean active = true;


    public static Employee mapFromDto(EmployeeDto employeeDto) {
        Employee employee = new Employee();
        employee.setEmail(employeeDto.getEmail());
        employee.setPassword(employeeDto.getPassword());
        employee.setPhone(employeeDto.getPhone());
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setTitle(employeeDto.getTitle());
        return employee;
    }
}
