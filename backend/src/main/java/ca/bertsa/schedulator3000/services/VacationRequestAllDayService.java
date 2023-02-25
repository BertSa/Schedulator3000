package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.VacationRequestAllDayDto;
import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.VacationRequestAllDay;
import ca.bertsa.schedulator3000.repositories.VacationRequestAllDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacationRequestAllDayService {

    private final VacationRequestAllDayRepository vacationRequestAllDayRepository;
    private final EmployeeService employeeService;

    public VacationRequestAllDayDto createVacationRequestAllDay(VacationRequestAllDayDto dto) {
        final VacationRequestAllDay vacationRequest = dto.mapToVacationRequestAllDay();
        vacationRequest.setStatus(VacationRequestStatus.PENDING);
        vacationRequest.setId(null);

        final Employee employee = employeeService.getOneByEmail(dto.getEmployeeEmail());
        vacationRequest.setEmployee(employee);

        final VacationRequestAllDay save = vacationRequestAllDayRepository.save(vacationRequest);
        return save.mapToDto();
    }

    public VacationRequestAllDayDto update(Long id, VacationRequestAllDayDto dto) {
        Assert.notNull(id, "Id must not be null");

        final VacationRequestAllDay vacationRequest = vacationRequestAllDayRepository.getById(id);
        vacationRequest.setDate(dto.getDate());
        vacationRequest.setReason(dto.getReason());
        vacationRequest.setType(dto.getType());

        final VacationRequestAllDay request = vacationRequestAllDayRepository.save(vacationRequest);
        return request.mapToDto();
    }

    public boolean deleteById(Long id) {
        final VacationRequestAllDay vacationRequest = vacationRequestAllDayRepository.getById(id);
        final VacationRequestStatus status = vacationRequest.getStatus();

        if (status != VacationRequestStatus.REJECTED && status != VacationRequestStatus.PENDING) {
            throw new IllegalArgumentException("Vacation request can only be deleted when status is rejected or pending");
        }

        vacationRequestAllDayRepository.deleteById(id);
        return true;
    }



    public List<VacationRequestAllDayDto> getAllByEmployeeManagerEmail(String email) {
        Assert.isTrue(email != null && email.length() > 0, "Email must not be null or empty");

        final List<VacationRequestAllDay> vacationRequests = vacationRequestAllDayRepository.findAllByEmployee_Manager_Email(email);

        return vacationRequests.stream()
                .map(VacationRequestAllDay::mapToDto)
                .collect(Collectors.toList());
    }

    public List<VacationRequestAllDayDto> getAllByEmployeeEmail(String email) {
        Assert.isTrue(email != null && email.length() > 0, "Email must not be null or empty");

        final List<VacationRequestAllDay> vacationRequests = vacationRequestAllDayRepository.findAllByEmployee_Email(email);

        return vacationRequests.stream()
                .map(VacationRequestAllDay::mapToDto)
                .collect(Collectors.toList());
    }

    public VacationRequestAllDayDto updateStatus(Long id, VacationRequestStatus status) {
        Assert.notNull(id, "Id must not be null");

        final VacationRequestAllDay vacationRequest = vacationRequestAllDayRepository.getById(id);
        vacationRequest.setStatus(status);

        final VacationRequestAllDay request = vacationRequestAllDayRepository.save(vacationRequest);
        return request.mapToDto();
    }
}
