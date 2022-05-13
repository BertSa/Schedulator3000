package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.models.Availabilities;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.repositories.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AvailabilitiesService {
    private final AvailabilityRepository availabilityRepository;

    public Availabilities getAvailabilities(String email) {
        return availabilityRepository.getByEmployee_EmailIgnoreCase(email);
    }

    public Availabilities updateAvailabilities(String email, Availabilities updatedAvailabilities) {
        final Availabilities availabilities = getAvailabilities(email);
        availabilities.setLastModified(LocalDateTime.now());
        availabilities.setMonday(updatedAvailabilities.getMonday());
        availabilities.setTuesday(updatedAvailabilities.getTuesday());
        availabilities.setWednesday(updatedAvailabilities.getWednesday());
        availabilities.setThursday(updatedAvailabilities.getThursday());
        availabilities.setFriday(updatedAvailabilities.getFriday());
        availabilities.setSaturday(updatedAvailabilities.getSaturday());
        availabilities.setSunday(updatedAvailabilities.getSunday());

        return availabilityRepository.save(availabilities);
    }

    public void createAvailabilitiesForEmployee(Employee employee) {
        final Availabilities availabilities = new Availabilities();
        availabilities.setEmployee(employee);
        availabilities.setLastModified(LocalDateTime.now());

        availabilityRepository.save(availabilities);
    }
}
