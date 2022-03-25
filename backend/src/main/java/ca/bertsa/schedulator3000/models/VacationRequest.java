package ca.bertsa.schedulator3000.models;

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
    private VacationRequestStatus status = VacationRequestStatus.PENDING;
}

