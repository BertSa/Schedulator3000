package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.dtos.ResponseMessage;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.services.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody ConnectionDto dto) {
        try {
            final var manager = managerService.signIn(dto);

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
            final var employees = managerService.getAllEmployee(emailManager);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(employees);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @PostMapping("/employees/create/{emailManager}")
    public ResponseEntity<?> createEmployee(@PathVariable String emailManager, @RequestBody Employee employee) {
        try {
            final var employeeAdded = managerService.createEmployee(emailManager, employee);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(employeeAdded);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @PutMapping("/employees/{id}/fire/{emailManager}")
    public ResponseEntity<?> fireEmployee(@PathVariable Long id, @PathVariable String emailManager) {
        try {
            final var employeeFired = managerService.fireEmployee(id, emailManager);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(employeeFired);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }
}
