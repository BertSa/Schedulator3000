package ca.bertsa.schedulator3000.models;

import ca.bertsa.schedulator3000.dtos.ManagerDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@JsonIgnoreProperties
public class Manager extends User {

    @OneToMany
    private List<Employee> employees = new ArrayList<>();
    @OneToMany(cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<VacationRequest> vacationRequests;
    @OneToMany
    private List<Holiday> holidays;


    public void addEmployee(Employee employee) {
        this.employees.add(employee);
    }

    public ManagerDto mapToDto() {
        final ManagerDto managerDto = new ManagerDto();
        managerDto.setEmail(this.getEmail());
        managerDto.setPassword(this.getPassword());
        managerDto.setPhone(this.getPhone());
        managerDto.setHolidays(this.getHolidays());
        managerDto.setId(this.getId());
        return managerDto;
    }
}
