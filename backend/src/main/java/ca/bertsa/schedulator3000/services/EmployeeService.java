package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.ConnectionDto;
import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.repositories.EmployeeRepository;
import org.hibernate.id.GUIDGenerator;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.UUID;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee getOneById(Long id) {
        return employeeRepository.getById(id);
    }

    public Employee create(EmployeeDto dto) {
        Assert.notNull(dto, "Employee cannot be null!");
        Assert.isTrue(
                !employeeRepository.existsByEmailIgnoreCase(dto.getEmail()),
                "Employee with email " + dto.getEmail() + " already exists!");

        Employee employee = dto.mapToEmployee();
        employee.setPassword(UUID.randomUUID().toString());

        return employeeRepository.save(employee);
    }

    public Employee signIn(ConnectionDto dto) {
        Assert.notNull(dto, "Email and password cannot be null!");

        Employee employee = employeeRepository.getByEmailIgnoreCaseAndPassword(dto.getEmail(), dto.getPassword());

        if (employee == null) {
            throw new EntityNotFoundException("Invalid email or password!");
        }

        return employee;
    }

    public void assertExistsByEmail(String employeeEmail) {
        Assert.notNull(employeeEmail, "Employee email cannot be null!");
        Assert.isTrue(employeeEmail.isEmpty(), "Employee email cannot be empty!");
        if (!employeeRepository.existsByEmailIgnoreCase(employeeEmail)) {
            throw new EntityNotFoundException("Employee with email " + employeeEmail + " does not exist!");
        }
    }
}

