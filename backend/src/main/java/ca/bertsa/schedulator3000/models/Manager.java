package ca.bertsa.schedulator3000.models;

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
public class Manager extends User {

    @OneToMany
    private List<Employee> employees = new ArrayList<>();
    @OneToMany(cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<WeekSchedule> weekSchedules;

    public void addEmployee(Employee employee) {
        this.employees.add(employee);
    }
}
