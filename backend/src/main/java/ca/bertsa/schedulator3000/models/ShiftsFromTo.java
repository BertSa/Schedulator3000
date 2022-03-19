package ca.bertsa.schedulator3000.models;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import java.time.LocalDate;

@Getter
@Setter
public class ShiftsFromTo {
    @Email
    private String managerEmail;
    private LocalDate from;
    private LocalDate to;
}
