package ca.bertsa.schedulator3000.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestScheduleEmployeeDto {
    private String employeeEmail;
    private String weekStart;
}
