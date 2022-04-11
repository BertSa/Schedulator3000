package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dtos.ManagerDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@JsonIgnoreProperties
public class Manager extends User {

    @JsonIgnore
    @OneToMany(cascade = CascadeType.REMOVE)
    private List<VacationRequest> vacationRequests;
    @OneToMany
    private List<Holiday> holidays;

    public ManagerDto mapToDto() {
        final ManagerDto managerDto = new ManagerDto();
        managerDto.setId(this.getId());
        managerDto.setEmail(this.getEmail());
        managerDto.setPassword(this.getPassword());
        managerDto.setPhone(this.getPhone());
        managerDto.setHolidays(this.getHolidays());
        return managerDto;
    }
}
