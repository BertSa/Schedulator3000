package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dto.ShiftDto;
import ca.bertsa.schedulator3000.models.ResponseMessage;
import ca.bertsa.schedulator3000.services.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/schedule")
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
                    .badRequest()
                    .body(new ResponseMessage(e.getMessage()));
        }
        return ResponseEntity.ok(new ResponseMessage("Done!"));
    }

    @PostMapping("/shift/add")
    public ResponseEntity<?> AddShift(@RequestBody ShiftDto shiftDto) {
        try {
            scheduleService.addShift(shiftDto);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ResponseMessage(e.getMessage()));
        }
        return ResponseEntity.ok(new ResponseMessage("Done!"));
    }
}
