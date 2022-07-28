package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ShiftsFromToDto;
import ca.bertsa.schedulator3000.models.Availabilities;
import ca.bertsa.schedulator3000.models.TimeSlot;
import ca.bertsa.schedulator3000.services.AvailabileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/available")
@RequiredArgsConstructor
public class AvailableController {
    private final AvailabileService availableService;

    @PostMapping("/employees")
    @ResponseStatus(HttpStatus.OK)
    public List<TimeSlot> getAvailabilities(@RequestBody ShiftsFromToDto dto) {
        return availableService.getAvailabilities(dto.getUserEmail(), dto.getFrom().atStartOfDay(), dto.getTo().atStartOfDay());
    }

    @PostMapping("/employees/{email}")
    @ResponseStatus(HttpStatus.CREATED)
    public TimeSlot create(@PathVariable String email, @RequestBody TimeSlot dto) {
        return availableService.createAvailabilities(email, dto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TimeSlot updateAvailabilities(@PathVariable Long id, @RequestBody TimeSlot availabilities) {
        return availableService.updateAvailabilities(id, availabilities);
    }
}
