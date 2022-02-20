package ca.bertsa.schedulator3000.dto;

import ca.bertsa.schedulator3000.models.Employee;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDto {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String phone;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String role;

    public Employee mapToEmployee() {
        Employee employee = new Employee();
        employee.setEmail(this.getEmail());
        employee.setPassword(this.getPassword());
        employee.setPhone(this.getPhone());
        employee.setFirstName(this.getFirstName());
        employee.setLastName(this.getLastName());
        employee.setRole(this.getRole());
        return employee;
    }
}
