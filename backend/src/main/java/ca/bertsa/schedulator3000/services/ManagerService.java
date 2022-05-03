package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
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

    public Employee createEmployee(String emailManager, Employee dto) {
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

    public void assertExistsByEmail(String managerEmail) {
        Assert.notNull(managerEmail, "Manager email cannot be null!");
        Assert.isTrue(!managerEmail.isEmpty(), "Manager email cannot be empty!");
        if (!managerRepository.existsByEmailIgnoreCase(managerEmail)) {
            throw new EntityNotFoundException("Employee with email " + managerEmail + " does not exist!");
        }
    }

    public Employee fireEmployee(Long id, String emailManager) {
        assertExistsByEmail(emailManager);

        final Employee employee = employeeService.getOneById(id);

        employee.setActive(false);

        return employeeService.update(employee);
    }

    public ManagerDto signup(ManagerDto managerDto) {
        Assert.notNull(managerDto, "Manager cannot be null!");

        if (managerRepository.existsByEmailIgnoreCase(managerDto.getEmail())) {
            throw new IllegalArgumentException("Manager with email " + managerDto.getEmail() + " already exists!");
        }

        final Manager manager = new Manager();
        manager.setEmail(managerDto.getEmail());
        manager.setPassword(managerDto.getPassword());
        manager.setPhone(managerDto.getPhone());
        manager.setCompanyName(managerDto.getCompanyName());

        final Manager created = managerRepository.save(manager);

        return created.mapToDto();
    }
}
