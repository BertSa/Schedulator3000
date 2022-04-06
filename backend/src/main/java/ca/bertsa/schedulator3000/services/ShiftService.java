package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.ShiftDto;
import ca.bertsa.schedulator3000.dtos.ShiftsFromToDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.models.Shift;
import ca.bertsa.schedulator3000.repositories.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ShiftService {

    private final ShiftRepository shiftRepository;
    private final EmployeeService employeeService;
    private final ManagerService managerService;

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

    public void delete(Long id) {
        shiftRepository.deleteById(id);
    }

    public List<ShiftDto> getAllFromTo(ShiftsFromToDto dto) {
        managerService.assertExistsByEmail(dto.getUserEmail());

        return shiftRepository.getAllByManager_EmailAndStartTimeBetween(dto.getUserEmail(), dto.getFrom().atStartOfDay(), dto.getTo().atStartOfDay())
                .stream()
                .map(Shift::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ShiftDto> getScheduleOfEmployee(ShiftsFromToDto dto) {
        employeeService.assertExistsByEmail(dto.getUserEmail());

        return shiftRepository.getAllByEmployee_EmailAndStartTimeBetween(dto.getUserEmail(), dto.getFrom().atStartOfDay(), dto.getTo().atStartOfDay())
                .stream()
                .map(Shift::mapToDto)
                .collect(Collectors.toList());
    }
}
