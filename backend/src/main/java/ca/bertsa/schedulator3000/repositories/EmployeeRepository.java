package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmail(String email);
}
