package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.models.Note;
import ca.bertsa.schedulator3000.services.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;

    @GetMapping("/{employeeEmail}")
    public Note getNoteByEmployeeEmail(@PathVariable String employeeEmail) {
        return noteService.getNoteByEmployeeEmail(employeeEmail);
    }

    @PutMapping("/{employeeEmail}")
    public Note updateNote(@PathVariable String employeeEmail, @RequestBody Note note) {
        return noteService.updateNote(employeeEmail, note);
    }
}
