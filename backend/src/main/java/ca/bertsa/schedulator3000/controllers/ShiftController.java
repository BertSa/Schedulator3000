package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ResponseMessage;
import ca.bertsa.schedulator3000.dtos.ShiftDto;
import ca.bertsa.schedulator3000.dtos.ShiftsFromToDto;
import ca.bertsa.schedulator3000.services.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftController {

    private final ShiftService shiftService;

    @PostMapping("/manager/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ShiftDto create(@RequestBody ShiftDto dto) {
        return shiftService.create(dto);
    }

    @PutMapping("/manager/update")
    @ResponseStatus(HttpStatus.OK)
    public ShiftDto update(@RequestBody ShiftDto dto) {
        return shiftService.update(dto);
    }

    @DeleteMapping("/manager/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseMessage delete(@PathVariable Long id) {
        shiftService.delete(id);
        return new ResponseMessage("Shift deleted");
    }

    @PostMapping("/manager")
    @ResponseStatus(HttpStatus.OK)
    public List<ShiftDto> getAll(@RequestBody ShiftsFromToDto dto) {
        return shiftService.getAllFromTo(dto);
    }

    @PostMapping("/employee")
    @ResponseStatus(HttpStatus.OK)
    public List<ShiftDto> getScheduleOfEmployee(@RequestBody ShiftsFromToDto dto) {
        return shiftService.getScheduleOfEmployee(dto);
    }

}
