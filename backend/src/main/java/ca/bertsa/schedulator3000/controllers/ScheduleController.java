package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dto.RequestScheduleEmployeeDto;
import ca.bertsa.schedulator3000.dto.ScheduleDto;
import ca.bertsa.schedulator3000.dto.ShiftDto;
import ca.bertsa.schedulator3000.models.ResponseMessage;
import ca.bertsa.schedulator3000.services.ScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@CrossOrigin
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping()
    public ResponseEntity<?> create() {
        try {
            scheduleService.create();
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseMessage("Done!"));
    }

    @PostMapping("/shift/add")
    public ResponseEntity<?> AddShift(@RequestBody ShiftDto dto) {
        try {
            scheduleService.addShift(dto);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new ResponseMessage("Done!"));
    }

    @GetMapping("/weekof/{weekFirstDay}")
    public ResponseEntity<?> getSchedule(@PathVariable String weekFirstDay) {
        try {
            final var schedule = scheduleService.getScheduleFromWeekFirstDay(LocalDate.parse(weekFirstDay));
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(schedule);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseMessage(e.getMessage()));
        }
    }

    @GetMapping("/employee/weekof")
    public ResponseEntity<?> getScheduleOfEmployee(@RequestBody RequestScheduleEmployeeDto dto) {
        try {
            final var schedule = scheduleService.getScheduleOfEmployee(dto);
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
