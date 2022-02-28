package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Manager getByEmailIgnoreCase(String emailManager);

    Manager getByEmailIgnoreCaseAndPassword(String email, String password);
}
