package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.dtos.ManagerDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.services.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @PostMapping("/signin")
    @ResponseStatus(HttpStatus.OK)
    public ManagerDto signIn(@RequestBody ConnectionDto dto) {
        return managerService.signIn(dto);
    }

    @GetMapping("/{emailManager}/employees")
    @ResponseStatus(HttpStatus.OK)
    public List<Employee> getAllEmployeeOfManager(@PathVariable String emailManager) {
        return managerService.getAllEmployee(emailManager);
    }

    @PostMapping("/{emailManager}/employees/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Employee createEmployee(@PathVariable String emailManager, @RequestBody Employee employee) {
        return managerService.createEmployee(emailManager, employee);
    }

    @PutMapping("/{emailManager}/employees/{id}/fire")
    @ResponseStatus(HttpStatus.OK)
    public Employee fireEmployee(@PathVariable Long id, @PathVariable String emailManager) {
        return managerService.fireEmployee(id, emailManager);
    }
}
