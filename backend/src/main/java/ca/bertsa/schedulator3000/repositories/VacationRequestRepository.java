package ca.bertsa.schedulator3000.repositories;

import ca.bertsa.schedulator3000.models.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VacationRequestRepository extends JpaRepository<VacationRequest, Long> {
    List<VacationRequest> findAllByEmployee_Manager_Email(String managerEmail);

    List<VacationRequest> findAllByEmployee_Email(String email);
}
