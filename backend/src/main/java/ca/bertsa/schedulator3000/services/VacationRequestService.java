package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.VacationRequestDto;
import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.VacationRequest;
import ca.bertsa.schedulator3000.repositories.VacationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VacationRequestService {

    private final VacationRequestRepository vacationRequestRepository;
    private final EmployeeService employeeService;

    public VacationRequestDto create(VacationRequestDto dto) {
        final VacationRequest vacationRequest = dto.mapToVacationRequest();
        vacationRequest.setStatus(VacationRequestStatus.PENDING);
        vacationRequest.setId(null);

        final Employee employee = employeeService.getOneByEmail(dto.getEmployeeEmail());
        vacationRequest.setEmployee(employee);

        final VacationRequest save = vacationRequestRepository.save(vacationRequest);
        return save.mapToDto();
    }

    public List<VacationRequestDto> getAllVacationRequestByEmployeeManagerEmail(String email) {
        Assert.isTrue(email != null && email.length() > 0, "Email must not be null or empty");

        final List<VacationRequest> vacationRequests = vacationRequestRepository.findAllByEmployee_Manager_Email(email);

        return vacationRequests.stream()
                .map(VacationRequest::mapToDto)
                .collect(Collectors.toList());
    }

    public List<VacationRequestDto> getAllVacationRequestByEmployeeEmail(String email) {
        Assert.isTrue(email != null && email.length() > 0, "Email must not be null or empty");

        final List<VacationRequest> vacationRequests = vacationRequestRepository.findAllByEmployee_Email(email);

        return vacationRequests.stream()
                .map(VacationRequest::mapToDto)
                .collect(Collectors.toList());
    }

    public VacationRequestDto updateVacationRequestStatus(Long id, VacationRequestStatus status) {
        Assert.notNull(id, "Id must not be null");

        final VacationRequest vacationRequest = vacationRequestRepository.getById(id);
        vacationRequest.setStatus(status);

        final VacationRequest request = vacationRequestRepository.save(vacationRequest);
        return request.mapToDto();
    }

    public VacationRequestDto update(Long id, VacationRequestDto dto) {
        Assert.notNull(id, "Id must not be null");

        final VacationRequest vacationRequest = vacationRequestRepository.getById(id);
        vacationRequest.setDate(dto.getDate());
        vacationRequest.setStartTime(dto.getStartTime());
        vacationRequest.setEndTime(dto.getEndTime());
        vacationRequest.setReason(dto.getReason());
        vacationRequest.setType(dto.getType());

        final VacationRequest request = vacationRequestRepository.save(vacationRequest);
        return request.mapToDto();
    }

    public boolean deleteVacationRequest(Long id) {
        final VacationRequest vacationRequest = vacationRequestRepository.getById(id);
        final VacationRequestStatus status = vacationRequest.getStatus();

        if (status != VacationRequestStatus.REJECTED && status != VacationRequestStatus.PENDING) {
            throw new IllegalArgumentException("Vacation request can only be deleted when status is rejected or pending");
        }

        vacationRequestRepository.deleteById(id);
        return true;
    }
}
