package ca.bertsa.schedulator3000.dtos;

import ca.bertsa.schedulator3000.models.TimeSlot;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class TimeSlotDto {
    private Long id;
    private String employeeEmail;
    private LocalDate startingDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int nbOfOccurrence;
    private int weekBetweenOccurrences;
    private List<Boolean> daysTheEventOccurre;

    public TimeSlot toTimeSlot() {
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setEmployee(null);
        timeSlot.setId(id);
        timeSlot.setStartingDate(startingDate.atStartOfDay());
        timeSlot.setEndDate(endDate.atStartOfDay());
        timeSlot.setStartTime(startTime);
        timeSlot.setEndTime(endTime);
        timeSlot.setNbOfOccurrence(nbOfOccurrence);
        timeSlot.setWeekBetweenOccurrences(weekBetweenOccurrences);
        timeSlot.setDaysTheEventOccurre(daysTheEventOccurre);
        return timeSlot;
    }
}
