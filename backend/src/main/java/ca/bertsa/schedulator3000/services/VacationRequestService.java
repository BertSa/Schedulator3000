package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.VacationRequestDto;
import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.extensions.StringExtensions;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.VacationRequest;
import ca.bertsa.schedulator3000.repositories.VacationRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.ExtensionMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@ExtensionMethod(StringExtensions.class)
public class VacationRequestService {

    private final VacationRequestRepository vacationRequestRepository;
    private final EmployeeService employeeService;

    public VacationRequest createVacationRequest(VacationRequestDto dto) {
        final VacationRequest vacationRequest = dto.mapToVacationRequest();
        vacationRequest.setStatus(VacationRequestStatus.PENDING);
        vacationRequest.setId(null);

        final Employee employee = employeeService.getOneByEmail(dto.getEmployeeEmail());
        vacationRequest.setEmployee(employee);

        return vacationRequestRepository.save(vacationRequest);
    }

    public List<VacationRequestDto> getAllVacationRequestByEmployeeManagerEmail(String email) {
        Assert.isTrue(!email.isNullOrEmpty(), "Email must not be null or empty");

        final List<VacationRequest> vacationRequests = vacationRequestRepository.findAllByEmployee_Manager_Email(email);

        return vacationRequests.stream()
                .map(VacationRequest::mapToDto)
                .collect(Collectors.toList());
    }

    public List<VacationRequestDto> getAllVacationRequestByEmployeeEmail(String email) {
        Assert.isTrue(!email.isNullOrEmpty(), "Email must not be null or empty");

        final List<VacationRequest> vacationRequests = vacationRequestRepository.findAllByEmployee_Email(email);

        return vacationRequests.stream()
                .map(VacationRequest::mapToDto)
                .collect(Collectors.toList());
    }

    public VacationRequest updateVacationRequestStatus(Long id, VacationRequestStatus status) {
        Assert.notNull(id, "Id must not be null");

        final VacationRequest vacationRequest = vacationRequestRepository.getById(id);
        vacationRequest.setStatus(status);

        return vacationRequestRepository.save(vacationRequest);
    }
}
