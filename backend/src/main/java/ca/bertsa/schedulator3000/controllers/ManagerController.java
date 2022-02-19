package ca.bertsa.schedulator3000.controllers;


import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.services.ManagerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/manager")
public class ManagerController {

    private final ManagerService employeeService;

    public ManagerController(ManagerService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/employees/{emailManager}")
    public ResponseEntity<?> getAllEmployeeOfManager(@PathVariable String emailManager) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(employeeService.getAllEmployee(emailManager));
    }

    @PostMapping("/add/{emailManager}")
    public ResponseEntity<?> addEmployee(@PathVariable String emailManager, @RequestBody EmployeeDto employee) {
        try {
            final Employee add = employeeService.addEmployee(emailManager, employee);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(add);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }

    }
}
