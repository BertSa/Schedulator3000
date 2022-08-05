package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> getAllByEmployee_EmailAndStartingDateBeforeAndEndDateAfter(String email, LocalDateTime end, LocalDateTime start);
}
