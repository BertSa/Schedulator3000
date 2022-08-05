package ca.bertsa.schedulator3000.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AvailabilityDto {
    private Long id;
    private LocalDateTime start;
    private LocalDateTime end;
}
