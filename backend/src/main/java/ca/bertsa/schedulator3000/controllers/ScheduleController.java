package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dto.RequestScheduleEmployeeDto;
import ca.bertsa.schedulator3000.dto.ShiftDto;
import ca.bertsa.schedulator3000.models.ResponseMessage;
import ca.bertsa.schedulator3000.models.ShiftsFromTo;
import ca.bertsa.schedulator3000.services.ShiftService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/shifts")
public class ScheduleController {

    private final ShiftService shiftService;

    public ScheduleController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @PostMapping("/manager/create")
    public ResponseEntity<?> create(@RequestBody ShiftDto dto) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(shiftService.create(dto));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @PutMapping("/manager/update")
    public ResponseEntity<?> update(@RequestBody ShiftDto dto) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(shiftService.update(dto));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @DeleteMapping("/manager/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            shiftService.delete(id);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseMessage("Shift deleted"));
    }

    @PostMapping("/manager")
    public ResponseEntity<?> getAll(@RequestBody ShiftsFromTo dto) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(shiftService.getAllFromTo(dto));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @GetMapping("/employee/weekof")
    public ResponseEntity<?> getScheduleOfEmployee(@RequestBody RequestScheduleEmployeeDto dto) {
        try {
            final var schedule = shiftService.getScheduleOfEmployee(dto);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(schedule);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

}
