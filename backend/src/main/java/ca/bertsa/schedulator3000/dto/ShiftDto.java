package ca.bertsa.schedulator3000.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class ShiftDto implements Serializable {
    private Long id;
    private long idEmployee;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
