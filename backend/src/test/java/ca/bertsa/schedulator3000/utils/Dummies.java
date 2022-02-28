package ca.bertsa.schedulator3000.utils;

import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.dto.RequestScheduleEmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.models.Shift;
import ca.bertsa.schedulator3000.models.Schedule;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Dummies {
    public static List<Employee> getDummyEmployees() {
        final List<Employee> employees = new ArrayList<>();

        for (int i = 1; i < 5; i++) {
            Employee employee = new Employee();
            employee.setId((long) i);
            employee.setFirstName("Name");
            employee.setLastName("LastName");
            employee.setEmail("email" + i + "@email.com");
            employee.setPhone("phoneNumber");
            employee.setPassword("password");
            employee.setRole("ROLE_EMPLOYEE");

            employees.add(employee);
        }

        return employees;
    }

    public static Manager getDummyManager() {
        Manager manager = new Manager();
        manager.setId(1L);
        manager.setEmail("compagnieName@bertsa.com");
        manager.setPassword("password");
        manager.setPhone("1234567890");
        return manager;
    }

    public static EmployeeDto getDummyEmployeeDto() {
        final EmployeeDto employeeDto = new EmployeeDto();
        employeeDto.setFirstName("John");
        employeeDto.setLastName("Doe");
        employeeDto.setEmail("dummyEmployee@email.com");
        employeeDto.setPhone("1234567890");
        employeeDto.setRole("ROLE_MANAGER");
        return employeeDto;
    }

    public static Employee getDummyEmployee(long id) {
        final Employee employee = new Employee();
        employee.setId(id);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("johndoe@bertsa.ca");
        employee.setPassword("password");
        employee.setPhone("1234567890");
        employee.setRole("ROLE_MANAGER");

        return employee;
    }

    public static Schedule getDummySchedule() {
        Schedule schedule = new Schedule();
        schedule.setId(1L);
        for (int i = 1; i < 5; i++) {
            schedule.addOrReplaceShift(getDummyShift(i, getDummyEmployee(1L)));
        }
        return schedule;
    }

    public static Shift getDummyShift(long id, Employee employee) {
        Shift shift = new Shift(LocalDateTime.now(), LocalDateTime.now().plusHours(4), employee);
        shift.setId(id);
        return shift;
    }

    public static RequestScheduleEmployeeDto getDummyScheduleEmployee() {
        final RequestScheduleEmployeeDto requestScheduleEmployeeDto = new RequestScheduleEmployeeDto();
        requestScheduleEmployeeDto.setEmployeeEmail("employee@bertsa.ca");
        requestScheduleEmployeeDto.setWeekStart(LocalDate.now().toString());
        return requestScheduleEmployeeDto;
    }
}
