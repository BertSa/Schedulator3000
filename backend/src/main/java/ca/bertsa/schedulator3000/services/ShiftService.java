package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.RequestScheduleEmployeeDto;
import ca.bertsa.schedulator3000.dto.ShiftDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.models.Shift;
import ca.bertsa.schedulator3000.models.ShiftsFromTo;
import ca.bertsa.schedulator3000.repositories.ShiftRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final EmployeeService employeeService;
    private final ManagerService managerService;

    public ShiftService(ShiftRepository shiftRepository, EmployeeService employeeService, ManagerService managerService) {
        this.shiftRepository = shiftRepository;
        this.employeeService = employeeService;
        this.managerService = managerService;
    }

    public ShiftDto create(ShiftDto dto) {
        final Employee employee = employeeService.getOneByEmail(dto.getEmailEmployee());
        final Manager manager = managerService.getOneByEmail(dto.getEmailManager());

        Shift shift = new Shift(dto.getStartTime(), dto.getEndTime(), employee, manager);

        return shiftRepository.save(shift).mapToDto();
    }

    public ShiftDto update(ShiftDto dto) {
        Shift shift = shiftRepository.getById(dto.getId());
        shift.setStartTime(dto.getStartTime());
        shift.setEndTime(dto.getEndTime());
        shift.setEmployee(employeeService.getOneByEmail(dto.getEmailEmployee()));

        return shiftRepository.save(shift).mapToDto();
    }

    public List<ShiftDto> getAllFromTo(ShiftsFromTo dto) {
        return shiftRepository.getAllByManager_EmailAndStartTimeBetween(dto.getManagerEmail(), dto.getFrom().atTime(0, 0), dto.getTo().atTime(0, 0))
                .stream()
                .map(Shift::mapToDto)
                .collect(Collectors.toList());
    }

    public List<Shift> getScheduleOfEmployee(RequestScheduleEmployeeDto dto) {
        employeeService.assertExistsByEmail(dto.getEmployeeEmail());

        final LocalDateTime startTime = LocalDateTime.parse(dto.getWeekStart());

        return shiftRepository.getAllByEmployee_EmailAndStartTimeBetween(dto.getEmployeeEmail(), startTime, startTime.plusDays(7));
    }
}
