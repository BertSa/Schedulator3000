package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Schedule getFirstByOrderByStartDateDesc();
    Schedule getWeekScheduleByStartDateIsBefore(LocalDate date);
    Schedule getWeekScheduleByStartDateIsBetween(LocalDate date, LocalDate date2);
}
