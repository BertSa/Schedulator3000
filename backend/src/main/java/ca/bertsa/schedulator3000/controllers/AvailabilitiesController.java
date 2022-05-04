package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.models.Availabilities;
import ca.bertsa.schedulator3000.services.AvailabilitiesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/availabilities")
@RequiredArgsConstructor
public class AvailabilitiesController {
    private final AvailabilitiesService availabilitiesService;

    @GetMapping("/{email}")
    public Availabilities getAvailabilities(@PathVariable String email) {
        return availabilitiesService.getAvailabilities(email);
    }

    @PutMapping("/{email}")
    public Availabilities updateAvailabilities(@PathVariable String email, @RequestBody Availabilities availabilities) {
        return availabilitiesService.updateAvailabilities(email, availabilities);
    }
}
