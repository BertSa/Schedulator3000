package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dtos.VacationRequestDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
public class VacationRequest extends Vacation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Employee employee;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    public VacationRequestDto mapToDto() {
        VacationRequestDto dto = new VacationRequestDto();
        dto.setId(this.id);
        dto.setEmployeeEmail(this.employee.getEmail());
        dto.setDate(this.date);
        dto.setStartTime(this.startTime);
        dto.setEndTime(this.endTime);
        dto.setReason(getReason());
        dto.setStatus(getStatus());
        dto.setType(getType());
        return dto;
    }
}

