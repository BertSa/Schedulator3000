package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ResponseMessage;
import ca.bertsa.schedulator3000.dtos.VacationRequestDto;
import ca.bertsa.schedulator3000.enums.VacationRequestStatus;
import ca.bertsa.schedulator3000.services.VacationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/vacation-requests")
@RequiredArgsConstructor
public class VacationRequestController {
    private final VacationRequestService vacationRequestService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody VacationRequestDto dto) {

        try {
            final var vacation = vacationRequestService.createVacationRequest(dto);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(vacation);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveVacation(@PathVariable Long id) {
        try {
            final var vacation = vacationRequestService.updateVacationRequestStatus(id, VacationRequestStatus.APPROVED);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(vacation);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectVacation(@PathVariable Long id) {
        try {
            final var vacation = vacationRequestService.updateVacationRequestStatus(id, VacationRequestStatus.REJECTED);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(vacation);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelVacation(@PathVariable Long id) {
        try {
            final var vacation = vacationRequestService.updateVacationRequestStatus(id, VacationRequestStatus.CANCELLED);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(vacation);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @GetMapping("/manager/{managerEmail}")
    public ResponseEntity<?> getAllByEmployeeManagerEmail(@PathVariable String managerEmail) {
        try {
            final var vacations = vacationRequestService.getAllVacationRequestByEmployeeManagerEmail(managerEmail);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(vacations);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @GetMapping("/employee/{employeeEmail}")
    public ResponseEntity<?> getAllByEmployeeEmail(@PathVariable String employeeEmail) {
        try {
            final var vacations = vacationRequestService.getAllVacationRequestByEmployeeEmail(employeeEmail);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(vacations);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }
}
