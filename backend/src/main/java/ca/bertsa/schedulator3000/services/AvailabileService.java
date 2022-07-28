package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.TimeSlot;
import ca.bertsa.schedulator3000.repositories.AvailableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static ca.bertsa.schedulator3000.converters.BooleanListConverter.getFalsyList;

@Service
@RequiredArgsConstructor
public class AvailabileService {
    private final AvailableRepository availableRepository;
    private final EmployeeService employeeService;

    public List<TimeSlot> getAvailabilities(String email, LocalDateTime start, LocalDateTime end) {
        final List<TimeSlot> timeSlots = availableRepository.getAllByEmployee_EmailAndStartingDateBeforeAndEndDateAfter(email, end, start);

        if (timeSlots == null) {
            return new ArrayList<>();
        }

        return timeSlots;
    }

    public TimeSlot updateAvailabilities(Long id, TimeSlot slot)
    {
        final TimeSlot timeSlot = availableRepository.getById(id);

        final LocalDateTime startingDate = slot.getStartingDate();
        final int nbOfOccurrence = slot.getNbOfOccurrence();
        final int weekBetweenOccurrences = slot.getWeekBetweenOccurrences();
        List<Boolean> daysTheEventOccurre = slot.getDaysTheEventOccurre();

        int startingDayDayOfWeek = getStartingDayDayOfWeek(startingDate);

        daysTheEventOccurre = verifyAndCorrectDaysTheEventOccurre(daysTheEventOccurre, startingDayDayOfWeek);

        int nbDaysToAddForLastDayOfTheEvent = getNbDaysToAddForLastDayOfTheEvent(startingDayDayOfWeek, daysTheEventOccurre);

        LocalDateTime endDate = getEnd(weekBetweenOccurrences, startingDate, nbDaysToAddForLastDayOfTheEvent, nbOfOccurrence);

        timeSlot.setNbOfOccurrence(nbOfOccurrence);
        timeSlot.setWeekBetweenOccurrences(weekBetweenOccurrences);
        timeSlot.setDaysTheEventOccurre(daysTheEventOccurre);
        timeSlot.setStartingDate(startingDate);
        timeSlot.setEndDate(endDate);
        timeSlot.setStartTime(slot.getStartTime());
        timeSlot.setEndTime(slot.getEndTime());

        return availableRepository.save(timeSlot);
    }

    public TimeSlot createAvailabilities(String email, TimeSlot slot) {
        final LocalDateTime startingDate = slot.getStartingDate();
        final int nbOfOccurrence = slot.getNbOfOccurrence();
        final int weekBetweenOccurrences = slot.getWeekBetweenOccurrences();
        List<Boolean> daysTheEventOccurre = slot.getDaysTheEventOccurre();

        final Employee employee = employeeService.getOneByEmail(email);
        slot.setEmployee(employee);


        int startingDayDayOfWeek = getStartingDayDayOfWeek(startingDate);

        daysTheEventOccurre = verifyAndCorrectDaysTheEventOccurre(daysTheEventOccurre, startingDayDayOfWeek);

        int nbDaysToAddForLastDayOfTheEvent = getNbDaysToAddForLastDayOfTheEvent(startingDayDayOfWeek, daysTheEventOccurre);
        LocalDateTime endDate = getEnd(weekBetweenOccurrences, startingDate, nbDaysToAddForLastDayOfTheEvent, nbOfOccurrence);
        slot.setEndDate(endDate);

        return availableRepository.save(slot);
    }

    private LocalDateTime getEnd(int weekBetweenOccurrences, LocalDateTime startingDate, int nbDaysToAddForLastDayOfTheEvent, int nbOfOccurrence) {
        LocalDateTime endDate;
        if (nbOfOccurrence <= 0) {
            endDate = LocalDateTime.of(6969, 4, 20, 11, 11, 11, 11);
        } else {
            final int nbOfWeekToAdd = (nbOfOccurrence - 1) * weekBetweenOccurrences;
            endDate = startingDate
                    .plusDays(nbDaysToAddForLastDayOfTheEvent)
                    .plusDays(1)// If the availability goes to the next day
                    .plusWeeks(nbOfWeekToAdd);
        }
        return endDate;
    }

    private int getNbDaysToAddForLastDayOfTheEvent(int startingDayDayOfWeek, List<Boolean> daysTheEventOccurre) {
        int lastDayOfTheEvent = daysTheEventOccurre.lastIndexOf(true);
        lastDayOfTheEvent -= startingDayDayOfWeek;

        if (lastDayOfTheEvent < 0) {
            lastDayOfTheEvent = 0;
        }
        return lastDayOfTheEvent;
    }

    private int getStartingDayDayOfWeek(LocalDateTime startingDate) {
        int startingDayDayOfWeek = startingDate.getDayOfWeek().getValue();
        return startingDayDayOfWeek == 7 ? startingDayDayOfWeek : 0; // DayOfWeek Sunday is 7 but mine is 0
    }

    private List<Boolean> verifyAndCorrectDaysTheEventOccurre(List<Boolean> daysTheEventOccurre, int startingDayDayOfWeek) {
        if (daysTheEventOccurre.size() != 7) {
            daysTheEventOccurre = getFalsyList();
        }
        if (daysTheEventOccurre.stream().noneMatch(aBoolean -> aBoolean)) {
            daysTheEventOccurre.add(startingDayDayOfWeek, true);
            daysTheEventOccurre.remove(daysTheEventOccurre.size() - 1);
        }
        return daysTheEventOccurre;
    }
}
