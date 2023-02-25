package ca.bertsa.schedulator3000.dtos;

import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.models.VacationRequest;
import ca.bertsa.schedulator3000.models.VacationRequestAllDay;
import ca.bertsa.schedulator3000.models.VacationRequestType;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Getter
@Setter
public class VacationRequestAllDayDto {
    private Long id;
    @Email
    @NotBlank
    private String employeeEmail;
    private LocalDate date;
    @NotBlank
    private String reason;
    private VacationRequestType type = VacationRequestType.UNPAID;
    private VacationRequestStatus status;

    public VacationRequestAllDay mapToVacationRequestAllDay() {
        final VacationRequestAllDay vacationRequest = new VacationRequestAllDay();

        vacationRequest.setId(id);
        vacationRequest.setDate(date);
        vacationRequest.setReason(reason);
        vacationRequest.setStatus(status);
        vacationRequest.setType(type);

        return vacationRequest;
    }
}
