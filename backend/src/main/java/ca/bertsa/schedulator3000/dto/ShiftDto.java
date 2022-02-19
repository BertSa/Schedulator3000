package ca.bertsa.schedulator3000.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ShiftDto {
    private Long id;
    private long idEmployee;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
