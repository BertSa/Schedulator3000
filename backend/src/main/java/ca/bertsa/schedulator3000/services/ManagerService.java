package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.repositories.ManagerRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Service
public class ManagerService {
    private final EmployeeService employeeService;

    private final ManagerRepository managerRepository;

    public ManagerService(EmployeeService employeeService, ManagerRepository managerRepository) {
        this.employeeService = employeeService;
        this.managerRepository = managerRepository;
    }

    public List<Employee> getAllEmployee(String emailManager) {
        final Manager manager = managerRepository.getByEmail(emailManager);

        Assert.notNull(manager, "Manager with email " + emailManager + " does not exist");

        return manager.getEmployees();
    }

    public Employee addEmployee(String emailManager, EmployeeDto dto) {
        final Manager manager = managerRepository.getByEmail(emailManager);

        Assert.notNull(manager, "Manager with email " + emailManager + " does not exist");

        final Employee employee = employeeService.create(dto);
        manager.addEmployee(employee);
        managerRepository.save(manager);

        return employee;
    }
}
