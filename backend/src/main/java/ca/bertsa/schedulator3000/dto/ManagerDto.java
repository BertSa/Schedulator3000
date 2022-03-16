package ca.bertsa.schedulator3000.dto;

import ca.bertsa.schedulator3000.models.Holiday;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Setter
@Getter
public class ManagerDto {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String phone;
    private List<Holiday> holidays;
    private List<EmployeeDto> employees;
}
