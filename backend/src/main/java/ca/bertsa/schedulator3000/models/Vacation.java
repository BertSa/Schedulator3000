package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;
@Getter
@Setter
@MappedSuperclass
public class Vacation {
    @OneToOne
    private Employee employee;
    private String reason;
    @Enumerated(EnumType.STRING)
    private VacationRequestStatus status;
    @Enumerated(EnumType.STRING)
    private VacationRequestType type = VacationRequestType.UNPAID;
}
