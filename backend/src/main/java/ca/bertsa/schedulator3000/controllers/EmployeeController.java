package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.dtos.PasswordChangeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping("signin")
    @ResponseStatus(HttpStatus.OK)
    public Employee signIn(@RequestBody ConnectionDto dto) {
        return employeeService.signIn(dto);
    }

    @PostMapping("/password/update")
    @ResponseStatus(HttpStatus.OK)
    public Employee updatePassword(@RequestBody PasswordChangeDto dto) {
        return employeeService.updatePassword(dto);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public Employee updateEmployee(@RequestBody Employee employee) {
        return employeeService.updateEmployee(employee);
    }
}
