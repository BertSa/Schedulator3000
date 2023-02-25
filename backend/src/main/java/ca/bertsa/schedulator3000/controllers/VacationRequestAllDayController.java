package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.VacationRequestAllDayDto;
import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.services.VacationRequestAllDayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/vacation-requests/allday")
@RequiredArgsConstructor
public class VacationRequestAllDayController {
    private final VacationRequestAllDayService vacationRequestService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VacationRequestAllDayDto create(@RequestBody VacationRequestAllDayDto dto) {
        return vacationRequestService.createVacationRequestAllDay(dto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestAllDayDto update(@PathVariable Long id, @RequestBody VacationRequestAllDayDto dto) {
        return vacationRequestService.update(id, dto);
    }

    @PutMapping("/{id}/approve")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestAllDayDto approveVacation(@PathVariable Long id) {
        return vacationRequestService.updateStatus(id, VacationRequestStatus.APPROVED);
    }

    @PutMapping("/{id}/reject")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestAllDayDto rejectVacation(@PathVariable Long id) {
        return vacationRequestService.updateStatus(id, VacationRequestStatus.REJECTED);
    }

    @PutMapping("/{id}/cancel")
    @ResponseStatus(HttpStatus.OK)
    public VacationRequestAllDayDto cancelVacation(@PathVariable Long id) {
        return vacationRequestService.updateStatus(id, VacationRequestStatus.CANCELLED);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public boolean deleteVacation(@PathVariable Long id) {
        return vacationRequestService.deleteById(id);
    }

    @GetMapping("/manager/{managerEmail}")
    @ResponseStatus(HttpStatus.OK)
    public List<VacationRequestAllDayDto> getAllByEmployeeManagerEmail(@PathVariable String managerEmail) {
        return vacationRequestService.getAllByEmployeeManagerEmail(managerEmail);
    }

    @GetMapping("/employee/{employeeEmail}")
    @ResponseStatus(HttpStatus.OK)
    public List<VacationRequestAllDayDto> getAllByEmployeeEmail(@PathVariable String employeeEmail) {
        return vacationRequestService.getAllByEmployeeEmail(employeeEmail);
    }
}
