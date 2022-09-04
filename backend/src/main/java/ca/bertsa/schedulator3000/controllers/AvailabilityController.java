package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.AvailabilityDto;
import ca.bertsa.schedulator3000.dtos.ShiftsFromToDto;
import ca.bertsa.schedulator3000.dtos.TimeSlotDto;
import ca.bertsa.schedulator3000.services.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/availabilities")
@RequiredArgsConstructor
public class AvailabilityController {
    private final AvailabilityService availabilityService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TimeSlotDto getAvailability(@PathVariable Long id) {
        return availabilityService.getAvailability(id);
    }

    @PostMapping("/employees")
    @ResponseStatus(HttpStatus.OK)
    public List<AvailabilityDto> getAvailabilities(@RequestBody ShiftsFromToDto dto) {
        return availabilityService.getAvailabilities(dto.getUserEmail(), dto.getFrom().atStartOfDay(), dto.getTo().atStartOfDay());
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TimeSlotDto create(@RequestBody TimeSlotDto dto) {
        return availabilityService.createAvailabilities(dto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TimeSlotDto updateAvailabilities(@PathVariable Long id, @RequestBody TimeSlotDto availabilities) {
        return availabilityService.updateAvailabilities(id, availabilities);
    }
}
