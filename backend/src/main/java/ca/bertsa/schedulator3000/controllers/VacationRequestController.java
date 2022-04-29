package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.VacationRequestDto;
import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.services.VacationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/vacation-requests")
@RequiredArgsConstructor
public class VacationRequestController {
    private final VacationRequestService vacationRequestService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VacationRequestDto create(@RequestBody VacationRequestDto dto) {
        return vacationRequestService.createVacationRequest(dto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestDto update(@PathVariable Long id, @RequestBody VacationRequestDto dto) {
        return vacationRequestService.update(id, dto);
    }

    @PutMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestDto approveVacation(@PathVariable Long id) {
        return vacationRequestService.updateVacationRequestStatus(id, VacationRequestStatus.APPROVED);
    }

    @PutMapping("/{id}/reject")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestDto rejectVacation(@PathVariable Long id) {
        return vacationRequestService.updateVacationRequestStatus(id, VacationRequestStatus.REJECTED);
    }

    @PutMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestDto cancelVacation(@PathVariable Long id) {
        return vacationRequestService.updateVacationRequestStatus(id, VacationRequestStatus.CANCELLED);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public boolean deleteVacation(@PathVariable Long id) {
        return vacationRequestService.deleteVacationRequest(id);
    }

    @GetMapping("/manager/{managerEmail}")
    @ResponseStatus(HttpStatus.OK)
    public List<VacationRequestDto> getAllByEmployeeManagerEmail(@PathVariable String managerEmail) {
        return vacationRequestService.getAllVacationRequestByEmployeeManagerEmail(managerEmail);
    }

    @GetMapping("/employee/{employeeEmail}")
    @ResponseStatus(HttpStatus.OK)
    public List<VacationRequestDto> getAllByEmployeeEmail(@PathVariable String employeeEmail) {
        return vacationRequestService.getAllVacationRequestByEmployeeEmail(employeeEmail);
    }
}
