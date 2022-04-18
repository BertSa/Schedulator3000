package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.dtos.PasswordChangeDto;
import ca.bertsa.schedulator3000.exceptions.EmployeeInactiveException;
import ca.bertsa.schedulator3000.exceptions.UserNotFoundException;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public Employee getOneById(Long id) {
        return employeeRepository.getById(id);
    }

    public Employee getOneByEmail(String email) {
        final Employee employee = employeeRepository.getByEmailIgnoreCase(email);

        if (employee == null) {
            throw new EntityNotFoundException("Employee not found");
        }

        return employee;
    }

    public Employee create(Employee employee, Manager manager) {
        Assert.notNull(employee, "Employee cannot be null!");
        Assert.isTrue(
                !employeeRepository.existsByEmailIgnoreCase(employee.getEmail()),
                "Employee with email " + employee.getEmail() + " already exists!");

        employee.setManager(manager);
        employee.setPassword(UUID.randomUUID().toString());

        return employeeRepository.save(employee);
    }

    public Employee signIn(ConnectionDto dto) {
        Assert.notNull(dto, "Email and password cannot be null!");

        Employee employee = employeeRepository.getByEmailIgnoreCaseAndPassword(dto.getEmail(), dto.getPassword());

        if (employee == null) {
            throw new UserNotFoundException("Invalid email or password!");
        }

        if (Boolean.FALSE.equals(employee.getActive())) {
            throw new EmployeeInactiveException("Employee is not active!");
        }

        return employee;
    }

    public void assertExistsByEmail(String employeeEmail) {
        Assert.notNull(employeeEmail, "Employee email cannot be null!");
        Assert.isTrue(!employeeEmail.isEmpty(), "Employee email cannot be empty!");
        if (!employeeRepository.existsByEmailIgnoreCase(employeeEmail)) {
            throw new EntityNotFoundException("Employee with email " + employeeEmail + " does not exist!");
        }
    }

    public List<Employee> getAllByManager(Manager manager) {
        return employeeRepository.getAllByManagerAndActiveIsTrueOrActiveIsNull(manager);
    }

    public Employee updatePassword(PasswordChangeDto dto) {
        final Employee employee = employeeRepository.getByEmailIgnoreCaseAndPassword(dto.getEmail(), dto.getCurrentPassword());

        employee.setPassword(dto.getNewPassword());
        employee.setActive(true);

        return employeeRepository.save(employee);
    }

    public Employee update(Employee employee) {
        Assert.notNull(employee, "Employee cannot be null!");
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Employee employee) {
        final Employee oneByEmail = getOneByEmail(employee.getEmail());

        oneByEmail.setFirstName(employee.getFirstName());
        oneByEmail.setLastName(employee.getLastName());
        oneByEmail.setPhone(employee.getPhone());
        oneByEmail.setRole(employee.getRole());

        return employeeRepository.save(oneByEmail);
    }
}

