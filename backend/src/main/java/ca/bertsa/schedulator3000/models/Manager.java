package ca.bertsa.schedulator3000.models;

import lombok.Getter;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
public class Manager extends User {

    @OneToMany
    private List<Employee> employees;
    @OneToMany(cascade = CascadeType.REMOVE)
    private List<WeekSchedule> weekSchedules;

    public void addEmployee(Employee employee) {
        this.employees.add(employee);
    }
}
