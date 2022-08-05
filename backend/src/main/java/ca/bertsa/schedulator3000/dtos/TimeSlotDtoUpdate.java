package ca.bertsa.schedulator3000.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeSlotDtoUpdate extends TimeSlotDto {
    private TimeSlotDtoUpdateType updateType;
}

