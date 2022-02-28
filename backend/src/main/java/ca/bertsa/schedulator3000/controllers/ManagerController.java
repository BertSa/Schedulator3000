package ca.bertsa.schedulator3000.controllers;


import ca.bertsa.schedulator3000.dto.ConnectionDto;
import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.models.ResponseMessage;
import ca.bertsa.schedulator3000.services.ManagerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/manager")
public class ManagerController {

    private final ManagerService employeeService;

    public ManagerController(ManagerService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody ConnectionDto dto) {
        try {
            final var manager = employeeService.signIn(dto);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(manager);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @GetMapping("/employees/{emailManager}")
    public ResponseEntity<?> getAllEmployeeOfManager(@PathVariable String emailManager) {
        try {
            final var employees = employeeService.getAllEmployee(emailManager);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(employees);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @PostMapping("/employees/add/{emailManager}")
    public ResponseEntity<?> addEmployee(@PathVariable String emailManager, @RequestBody EmployeeDto dto) {
        try {
            final var employeeAdded = employeeService.addEmployee(emailManager, dto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(employeeAdded);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }

    }
}
