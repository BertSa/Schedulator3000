package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.ScheduleDto;
import ca.bertsa.schedulator3000.dto.ShiftDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Shift;
import ca.bertsa.schedulator3000.models.Schedule;
import ca.bertsa.schedulator3000.repositories.ScheduleRepository;
import ca.bertsa.schedulator3000.repositories.ShiftRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    private final ShiftRepository shiftRepository;
    private final EmployeeService employeeService;

    public ScheduleService(ScheduleRepository scheduleRepository, ShiftRepository shiftRepository, EmployeeService employeeService) {
        this.scheduleRepository = scheduleRepository;
        this.shiftRepository = shiftRepository;
        this.employeeService = employeeService;
    }


    public Schedule create() {
        Schedule weekSchedule = scheduleRepository.getFirstByOrderByStartDateDesc();
        Schedule entity;
        if (weekSchedule == null) {
            entity = new Schedule(LocalDate.now());
        } else {
            entity = new Schedule(weekSchedule.getStartDate());
        }

        return scheduleRepository.save(entity);
    }

    public void addShift(ShiftDto dto) {
        Employee employee = employeeService.getOneById(dto.getIdEmployee());
        if (employee == null) {
            throw new EntityNotFoundException("Employee not found");
        }
        Schedule weekScheduleByStartDateIsBefore = scheduleRepository.getWeekScheduleByStartDateIsBetween(dto.getStartTime().toLocalDate().minusDays(7), dto.getEndTime().toLocalDate());
        if (weekScheduleByStartDateIsBefore == null) {
            do {
                weekScheduleByStartDateIsBefore = create();
            }
            while (weekScheduleByStartDateIsBefore.getStartDate().isBefore(dto.getStartTime().toLocalDate().minusDays(7)));
        }

        Shift shift = new Shift(dto.getStartTime(), dto.getEndTime(), employee);
        final Shift save = shiftRepository.save(shift);

        weekScheduleByStartDateIsBefore.addOrReplaceShift(save);
        scheduleRepository.save(weekScheduleByStartDateIsBefore);
    }

    public ScheduleDto getScheduleFromWeekFirstDay(LocalDate weekFirstDay) {
        return null;
    }
}
