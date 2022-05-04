package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Availabilities;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilityRepository extends JpaRepository<Availabilities, Long> {
    Availabilities getByEmployee_EmailIgnoreCase(String email);
}
