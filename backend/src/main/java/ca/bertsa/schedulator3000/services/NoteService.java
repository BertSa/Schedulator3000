package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Note;
import ca.bertsa.schedulator3000.repositories.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;
    private final EmployeeService employeeService;

    public Note getNoteByEmployeeEmail(String employeeEmail) {
        Note note = noteRepository.getByEmployee_EmailIgnoreCase(employeeEmail);
        if (note == null) {
            note = createNoteForEmployee(employeeService.getOneByEmail(employeeEmail));
        }
        return note;
    }

    public Note createNoteForEmployee(Employee employee) {
        final Note employeeNote = noteRepository.getByEmployee_EmailIgnoreCase(employee.getEmail());
        Assert.isNull(employeeNote, "Note already exists for employee with email: " + employee.getEmail());

        final Note note = new Note();
        note.setEmployee(employee);
        note.setText("");
        note.setLastModified(LocalDateTime.now());

        return noteRepository.save(note);
    }

    public Note updateNote(String employeeEmail, Note note) {
        Note existingNote = noteRepository.getByEmployee_EmailIgnoreCase(employeeEmail);

        if (existingNote == null) {
            final Employee employee = employeeService.getOneByEmail(employeeEmail);
            existingNote = createNoteForEmployee(employee);
        }

        existingNote.setText(note.getText());
        existingNote.setLastModified(LocalDateTime.now());

        return noteRepository.save(existingNote);
    }
}
