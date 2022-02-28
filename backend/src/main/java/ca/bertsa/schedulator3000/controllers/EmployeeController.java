package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dto.ConnectionDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.ResponseMessage;
import ca.bertsa.schedulator3000.services.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/employee")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }


    @PostMapping("signin")
    public ResponseEntity<?> signIn(@RequestBody ConnectionDto dto) {
        try {
            final var employee = employeeService.signIn(dto);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(employee);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }
}
