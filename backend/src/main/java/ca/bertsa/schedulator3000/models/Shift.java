package ca.bertsa.schedulator3000.models;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    @OneToOne
    private Employee employee;

    public Shift(LocalDateTime startTime, LocalDateTime endTime, Employee employee) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.employee = employee;
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
