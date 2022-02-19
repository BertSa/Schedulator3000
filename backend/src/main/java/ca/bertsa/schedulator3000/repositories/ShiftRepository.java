package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
}
