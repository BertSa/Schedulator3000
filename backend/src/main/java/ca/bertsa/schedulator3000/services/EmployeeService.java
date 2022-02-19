package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.repositories.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee getOneById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Employee not found"));
    }

    public List<Employee> getAll() {
        return null;
    }

    public Employee create(EmployeeDto dto) {
        Assert.notNull(dto, "Employee cannot be null!");
        Assert.isTrue(
                employeeRepository.existsByEmail(dto.getEmail()),
                "Employee with email " + dto.getEmail() + " already exists!");

        Employee employee = Employee.mapFromDto(dto);

        return employeeRepository.save(employee);
    }
}
