package ca.bertsa.schedulator3000.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode
public class ScheduleDto implements Serializable {
    private Long id;
    private List<ShiftDto> shifts;
    private LocalDate startDate;
}
