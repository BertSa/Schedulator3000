package ca.bertsa.schedulator3000.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
@Getter
@Setter
public class AvailabilityDay {
    private LocalDateTime start;
    private LocalDateTime end;
}
