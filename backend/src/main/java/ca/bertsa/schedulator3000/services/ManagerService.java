package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.dtos.EmployeeDto;
import ca.bertsa.schedulator3000.dtos.ManagerDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.repositories.ManagerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ManagerService {
    private final EmployeeService employeeService;

    private final ManagerRepository managerRepository;

    public List<Employee> getAllEmployee(String emailManager) {
        final Manager manager = getOneByEmail(emailManager);
        return employeeService.getAllByManager(manager);
    }

    public Employee createEmployee(String emailManager, EmployeeDto dto) {
        final Manager manager = getOneByEmail(emailManager);

        return employeeService.create(dto, manager);
    }

    public Manager getOneByEmail(String emailManager) {
        final Manager manager = managerRepository.getByEmailIgnoreCase(emailManager);
        if (manager == null) {
            throw new EntityNotFoundException("Manager with email " + emailManager + " does not exist!");
        }
        return manager;
    }

    public ManagerDto signIn(ConnectionDto dto) {
        Assert.notNull(dto, "Email and password cannot be null!");

        final Manager manager = managerRepository.getByEmailIgnoreCaseAndPassword(dto.getEmail(), dto.getPassword());
        if (manager == null) {
            throw new EntityNotFoundException("Invalid email or password!");
        }

        return manager.mapToDto();
    }
}
