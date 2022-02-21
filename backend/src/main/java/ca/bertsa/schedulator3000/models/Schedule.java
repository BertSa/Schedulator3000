package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dto.ScheduleDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "week_schedule_seq")
    private Long id;

    @OneToMany
    private final List<Shift> shifts = new ArrayList<>();
    private final LocalDate startDate;

    public Schedule(LocalDate lastWeekSunday) {
        this.startDate = lastWeekSunday.with(TemporalAdjusters.next(DayOfWeek.SUNDAY));
    }


    public Schedule() {
        this(LocalDate.now());
    }

    public void addOrReplaceShift(Shift shift) {
        if (shifts.contains(shift)) {
            shifts.set(shifts.indexOf(shift), shift);
        } else {
            shifts.add(shift);
        }
    }

    public ScheduleDto mapToDto() {
        final ScheduleDto dto = new ScheduleDto();
        dto.setId(getId());
        dto.setStartDate(getStartDate());
        dto.setShifts(getShifts()
                .stream()
                .map(Shift::mapToDto)
                .collect(Collectors.toList()));
        return dto;
    }
}
