package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.RequestScheduleEmployeeDto;
import ca.bertsa.schedulator3000.dto.ScheduleDto;
import ca.bertsa.schedulator3000.dto.ShiftDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Schedule;
import ca.bertsa.schedulator3000.models.Shift;
import ca.bertsa.schedulator3000.repositories.ScheduleRepository;
import ca.bertsa.schedulator3000.repositories.ShiftRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

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

    public Shift addShift(ShiftDto dto) {
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

        return save;
    }

    public ScheduleDto getScheduleFromWeekFirstDay(LocalDate weekFirstDay) {
        final LocalDate with = weekFirstDay.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        final Schedule weekScheduleByStartDateIsBetween = scheduleRepository.getWeekScheduleByStartDateIsBetween(with, with.plusDays(7));
        if (weekScheduleByStartDateIsBetween == null) {
            return createEmptySchedule(with);
        }
        return weekScheduleByStartDateIsBetween.mapToDto();
    }

    private ScheduleDto createEmptySchedule(LocalDate weekFirstDay) {
        ScheduleDto scheduleDto = new ScheduleDto();
        scheduleDto.setStartDate(weekFirstDay);
        scheduleDto.setShifts(List.of());
        return scheduleDto;
    }

    public ScheduleDto getScheduleOfEmployee(RequestScheduleEmployeeDto dto) {
        employeeService.assertExistsByEmail(dto.getEmployeeEmail());

        final LocalDateTime startTime = LocalDateTime.parse(dto.getWeekStart());
        final List<Shift> employeeShifts = shiftRepository.getAllByEmployee_EmailAndStartTimeBetween(dto.getEmployeeEmail(), startTime, startTime.plusDays(7));

        final List<ShiftDto> shiftDtos = employeeShifts.stream()
                .map(Shift::mapToDto)
                .collect(Collectors.toList());
        final ScheduleDto scheduleDto = new ScheduleDto();
        scheduleDto.setShifts(shiftDtos);
        return scheduleDto;
    }

    public Shift update(ShiftDto dto) {
        Shift shift = shiftRepository.getById(dto.getId());
        shift.setStartTime(dto.getStartTime());
        shift.setEndTime(dto.getEndTime());
        shift.setEmployee(employeeService.getOneById(dto.getIdEmployee()));
        final Shift save = shiftRepository.save(shift);

        return save;
    }
}
