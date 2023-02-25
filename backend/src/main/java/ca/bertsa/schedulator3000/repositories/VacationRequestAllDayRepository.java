package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.VacationRequestAllDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VacationRequestAllDayRepository extends JpaRepository<VacationRequestAllDay, Long> {
    List<VacationRequestAllDay> findAllByEmployee_Manager_Email(String email);

    List<VacationRequestAllDay> findAllByEmployee_Email(String email);
}
