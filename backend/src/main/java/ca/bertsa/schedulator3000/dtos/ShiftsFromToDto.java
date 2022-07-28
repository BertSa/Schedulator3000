package ca.bertsa.schedulator3000.dtos;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import java.time.LocalDate;

@Getter
@Setter
@ToString
public class ShiftsFromToDto {
    @Email
    private String userEmail;
    private LocalDate from;
    private LocalDate to;
}
