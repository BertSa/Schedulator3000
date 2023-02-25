package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dtos.VacationRequestAllDayDto;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class VacationRequestAllDay extends Vacation{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Employee employee;
    private LocalDate date;


    public VacationRequestAllDayDto mapToDto() {
        VacationRequestAllDayDto dto = new VacationRequestAllDayDto();
        dto.setId(this.id);
        dto.setEmployeeEmail(this.employee.getEmail());
        dto.setDate(this.date);
        dto.setReason(getReason());
        dto.setStatus(getStatus());
        dto.setType(getType());
        return dto;
    }
}

