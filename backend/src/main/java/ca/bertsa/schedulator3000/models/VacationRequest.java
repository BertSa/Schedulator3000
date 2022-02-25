package ca.bertsa.schedulator3000.models;

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

enum VacationRequestStatus {
    PENDING, APPROVED, REJECTED, CANCELLED
}
