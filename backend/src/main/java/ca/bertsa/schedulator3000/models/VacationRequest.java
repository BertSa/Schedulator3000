package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dtos.VacationRequestDto;
import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class VacationRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Employee employee;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    @Enumerated(EnumType.STRING)
    private VacationRequestStatus status;


    public VacationRequestDto mapToDto() {
        VacationRequestDto dto = new VacationRequestDto();
        dto.setId(this.id);
        dto.setEmployeeEmail(this.employee.getEmail());
        dto.setStartDate(this.startDate);
        dto.setEndDate(this.endDate);
        dto.setReason(this.reason);
        dto.setStatus(this.status);
        return dto;
    }
}

