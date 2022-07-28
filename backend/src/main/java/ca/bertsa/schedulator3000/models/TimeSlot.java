package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.converters.BooleanListConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@SequenceGenerator(name = "ts_seq", initialValue = 2)
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
    private int nbOfOccurrence = -1; // -1 is until delete or change
    private int weekBetweenOccurrences = 0;
    @Convert(converter = BooleanListConverter.class)
    private List<Boolean> daysTheEventOccurre;
}
