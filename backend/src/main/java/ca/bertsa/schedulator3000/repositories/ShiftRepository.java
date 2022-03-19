package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> getAllByEmployee_EmailAndStartTimeBetween(String employee_email, LocalDateTime startTime, LocalDateTime startTime2);

    List<Shift> getAllByManager_EmailAndStartTimeBetween(String managerEmail, LocalDateTime atTime, LocalDateTime atTime1);
}
