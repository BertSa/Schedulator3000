package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmailIgnoreCase(String email);

    Employee getByEmailIgnoreCaseAndPassword(String email, String password);

    Employee getByEmailIgnoreCase(String email);

    List<Employee> getAllByManager(Manager manager);
}
