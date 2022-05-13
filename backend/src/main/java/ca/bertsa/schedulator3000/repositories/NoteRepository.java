package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    Note getByEmployee_EmailIgnoreCase(String employeeEmail);
}
