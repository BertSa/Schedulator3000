package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.enums.HolidayType;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
public class Holiday {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "holiday_seq")
    private Long id;
    @Enumerated(EnumType.STRING)
    private HolidayType holidayType;
    private String name;
    private LocalDate date;
}
