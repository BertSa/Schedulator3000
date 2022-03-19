package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dto.ShiftDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    @OneToOne(cascade = CascadeType.ALL)
    private Employee employee;
    @OneToOne(cascade = CascadeType.ALL)
    private Manager manager;

    public Shift(LocalDateTime startTime, LocalDateTime endTime, Employee employee, Manager manager) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.employee = employee;
        this.manager = manager;
    }

    public ShiftDto mapToDto() {
        final ShiftDto dto = new ShiftDto();
        dto.setStartTime(getStartTime());
        dto.setEndTime(getEndTime());
        dto.setEmailEmployee(getEmployee().getEmail());
        dto.setEmailManager(getManager().getEmail());

        return dto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Shift)) {
            return false;
        }
        Shift shift = (Shift) o;
        return getId().equals(shift.getId()) && getEmployee().equals(shift.getEmployee());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getEmployee());
    }
}
