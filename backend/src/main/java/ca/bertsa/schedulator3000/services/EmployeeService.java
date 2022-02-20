package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.ConnectionDto;
import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.repositories.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;

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
                !employeeRepository.existsByEmail(dto.getEmail()),
                "Employee with email " + dto.getEmail() + " already exists!");

        Employee employee = dto.mapToEmployee();

        return employeeRepository.save(employee);
    }

    public Employee signIn(ConnectionDto dto) {
        Assert.notNull(dto, "Email and password cannot be null!");

        Employee employee = employeeRepository.getByEmailAndPassword(dto.getEmail(), dto.getPassword());

        if (employee == null) {
            throw new EntityNotFoundException("Invalid email or password!");
        }

        return employee;
    }
}
