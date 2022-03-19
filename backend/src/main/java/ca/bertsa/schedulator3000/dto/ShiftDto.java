package ca.bertsa.schedulator3000.dto;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class ShiftDto implements Serializable {
    private Long id;
    @Email
    private String emailEmployee;
    @Email
    private String emailManager;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
