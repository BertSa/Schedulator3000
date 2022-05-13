package ca.bertsa.schedulator3000.dtos;

import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.models.VacationRequest;
import ca.bertsa.schedulator3000.models.VacationRequestType;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Getter
@Setter
public class VacationRequestDto {
    private Long id;
    @Email
    @NotBlank
    private String employeeEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    @NotBlank
    private String reason;
    private VacationRequestType type = VacationRequestType.UNPAID;
    private VacationRequestStatus status;

    public VacationRequest mapToVacationRequest() {
        final VacationRequest vacationRequest = new VacationRequest();

        vacationRequest.setId(id);
        vacationRequest.setStartDate(startDate);
        vacationRequest.setEndDate(endDate);
        vacationRequest.setReason(reason);
        vacationRequest.setStatus(status);
        vacationRequest.setType(type);

        return vacationRequest;
    }
}
