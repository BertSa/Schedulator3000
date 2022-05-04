package ca.bertsa.schedulator3000.models;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.Nullable;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Embeddable
@Getter
@Setter
public class AvailabilityDay {
    @Nullable
    private LocalDateTime start;
    @Nullable
    private LocalDateTime end;
}
