package ca.bertsa.schedulator3000.models;

import lombok.Getter;

import javax.persistence.*;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class WeekSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "week_schedule_seq")
    private Long id;

    @OneToMany
    private final List<Shift> shifts = new ArrayList<>();
    @Column(unique = true)
    private final LocalDate startDate;

    public WeekSchedule(LocalDate lastWeekMonday) {
        this.startDate = lastWeekMonday.with(TemporalAdjusters.next(DayOfWeek.MONDAY));
    }


    public WeekSchedule() {
        this(LocalDate.now());
    }

    public void addOrReplaceShift(Shift shift) {
        if (shifts.contains(shift)) {
            shifts.set(shifts.indexOf(shift), shift);
        } else {
            shifts.add(shift);
        }
    }
}
