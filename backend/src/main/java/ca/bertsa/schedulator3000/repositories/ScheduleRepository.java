package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.WeekSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface ScheduleRepository extends JpaRepository<WeekSchedule, Long> {
    WeekSchedule getFirstByOrderByStartDateDesc();
    WeekSchedule getWeekScheduleByStartDateIsBefore(LocalDate date);
    WeekSchedule getWeekScheduleByStartDateIsBetween(LocalDate date, LocalDate date2);
}
