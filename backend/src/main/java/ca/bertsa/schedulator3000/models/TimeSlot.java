package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.converters.BooleanListConverter;
import ca.bertsa.schedulator3000.dtos.TimeSlotDto;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@ToString
@SequenceGenerator(name = "ts_seq", initialValue = 5)
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ts_seq")
    private Long id;
    @ManyToOne
    private Employee employee;
    private LocalDateTime startingDate;
    private LocalDateTime endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int nbOfOccurrence;
    private int weekBetweenOccurrences;
    @Convert(converter = BooleanListConverter.class)
    private List<Boolean> daysTheEventOccurre;

    public TimeSlotDto toDto() {
        final TimeSlotDto dto = new TimeSlotDto();
        dto.setEmployeeEmail(employee.getEmail());
        dto.setId(id);
        dto.setStartingDate(startingDate.toLocalDate());
        dto.setEndDate(endDate.toLocalDate());
        dto.setStartTime(startTime);
        dto.setEndTime(endTime);
        dto.setNbOfOccurrence(nbOfOccurrence);
        dto.setWeekBetweenOccurrences(weekBetweenOccurrences);
        dto.setDaysTheEventOccurre(daysTheEventOccurre);
        return dto;
    }
}
