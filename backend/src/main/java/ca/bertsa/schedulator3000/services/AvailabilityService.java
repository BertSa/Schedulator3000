package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.AvailabilityDto;
import ca.bertsa.schedulator3000.dtos.TimeSlotDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.TimeSlot;
import ca.bertsa.schedulator3000.repositories.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static ca.bertsa.schedulator3000.converters.BooleanListConverter.getFalsyList;

@Service
@RequiredArgsConstructor
public class AvailabilityService {
    private final AvailabilityRepository availabilityRepository;
    private final EmployeeService employeeService;
    public TimeSlotDto getAvailability(Long id) {
        return availabilityRepository.getById(id).toDto();
    }

    public List<AvailabilityDto> getAvailabilities(String email, LocalDateTime start, LocalDateTime end) {
        final List<TimeSlot> timeSlots = availabilityRepository.getAllByEmployee_EmailAndStartingDateBeforeAndEndDateAfter(email, end, start);

        return timeSlots.stream()
                .map(timeSlot -> {
                    final List<Boolean> daysTheEventOccurre = timeSlot.getDaysTheEventOccurre();
                    final int nbOfOccurrence = timeSlot.getNbOfOccurrence();
                    final int weekBetweenOccurrences = timeSlot.getWeekBetweenOccurrences();
                    final LocalDate startingDate = timeSlot.getStartingDate().toLocalDate();

                    final int[] daysOfTheWeekTheEventOccurre = IntStream
                            .range(0, daysTheEventOccurre.size())
                            .filter(daysTheEventOccurre::get)
                            .toArray();

                    int dayOfTheWeek = startingDate.getDayOfWeek().getValue();
                    if (dayOfTheWeek == 7) {
                        dayOfTheWeek = 0;
                    }

                    final LocalDate firstDayOfWeek = startingDate.minusDays(dayOfTheWeek + 1);

                    List<AvailabilityDto> availabilityDtos = new ArrayList<>();

                    for (int week = 0; week < nbOfOccurrence * weekBetweenOccurrences; week += weekBetweenOccurrences) {
                        final LocalDate firstDayOfThisWeek = firstDayOfWeek.plusWeeks(week);

                        for (int dayOfTheWeekTheEventOccurre : daysOfTheWeekTheEventOccurre) {
                            final LocalDate day = firstDayOfThisWeek.plusDays(dayOfTheWeekTheEventOccurre);

                            if (day.isAfter(end.toLocalDate())) {
                                break;
                            } else if (day.isBefore(start.toLocalDate())) {
                                continue;
                            }

                            final LocalDateTime startDateTime = day.atTime(timeSlot.getStartTime());
                            final LocalDateTime endDateTime = day.atTime(timeSlot.getEndTime());

                            final AvailabilityDto availabilityDto = new AvailabilityDto();
                            availabilityDto.setId(timeSlot.getId());
                            availabilityDto.setStart(startDateTime);
                            availabilityDto.setEnd(endDateTime);

                            availabilityDtos.add(availabilityDto);
                        }
                    }


                    return availabilityDtos;
                })
                .flatMap(Collection::stream)
                .collect(Collectors.toList());

    }

    public TimeSlotDto updateAvailabilities(Long id, TimeSlotDto dto) {
        final TimeSlot timeSlot = availabilityRepository.getById(id);

        final LocalDateTime startingDate = dto.getStartingDate().atStartOfDay();
        final int nbOfOccurrence = dto.getNbOfOccurrence();
        final int weekBetweenOccurrences = dto.getWeekBetweenOccurrences();
        List<Boolean> daysTheEventOccurre = dto.getDaysTheEventOccurre();

        int startingDayDayOfWeek = getStartingDayDayOfWeek(startingDate);

        daysTheEventOccurre = verifyAndCorrectDaysTheEventOccurre(daysTheEventOccurre, startingDayDayOfWeek);

        int nbDaysToAddForLastDayOfTheEvent = getNbDaysToAddForLastDayOfTheEvent(startingDayDayOfWeek, daysTheEventOccurre);

        LocalDateTime endDate = getEnd(weekBetweenOccurrences, startingDate, nbDaysToAddForLastDayOfTheEvent, nbOfOccurrence);

        timeSlot.setNbOfOccurrence(nbOfOccurrence);
        timeSlot.setWeekBetweenOccurrences(weekBetweenOccurrences);
        timeSlot.setDaysTheEventOccurre(daysTheEventOccurre);
        timeSlot.setStartingDate(startingDate);
        timeSlot.setEndDate(endDate);
        timeSlot.setStartTime(dto.getStartTime());
        timeSlot.setEndTime(dto.getEndTime());

        return availabilityRepository.save(timeSlot).toDto();
    }

    public TimeSlotDto createAvailabilities(TimeSlotDto dto) {
        final TimeSlot timeSlot = dto.toTimeSlot();
        final LocalDateTime startingDate = timeSlot.getStartingDate();
        final int nbOfOccurrence = timeSlot.getNbOfOccurrence();
        final int weekBetweenOccurrences = timeSlot.getWeekBetweenOccurrences();
        List<Boolean> daysTheEventOccurre = timeSlot.getDaysTheEventOccurre();

        final Employee employee = employeeService.getOneByEmail(dto.getEmployeeEmail());

        int startingDayDayOfWeek = getStartingDayDayOfWeek(startingDate);

        daysTheEventOccurre = verifyAndCorrectDaysTheEventOccurre(daysTheEventOccurre, startingDayDayOfWeek);

        int nbDaysToAddForLastDayOfTheEvent = getNbDaysToAddForLastDayOfTheEvent(startingDayDayOfWeek, daysTheEventOccurre);
        LocalDateTime endDate = getEnd(weekBetweenOccurrences, startingDate, nbDaysToAddForLastDayOfTheEvent, nbOfOccurrence);

        timeSlot.setEmployee(employee);
        timeSlot.setEndDate(endDate);
        timeSlot.setId(null);

        return availabilityRepository.save(timeSlot).toDto();
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
