package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dto.ConnectionDto;
import ca.bertsa.schedulator3000.dto.EmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.repositories.ManagerRepository;
import ca.bertsa.schedulator3000.utils.Dummies;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.persistence.EntityNotFoundException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ManagerServiceTest {

    @InjectMocks
    private ManagerService managerService;

    @Mock
    private EmployeeService employeeService;

    @Mock
    private ManagerRepository managerRepository;

    @Nested
    @DisplayName("getAllEmployees")
    class GetAllEmployeeTest {

        @Test
        @DisplayName("Should return all employees")
        public void shouldReturnAllEmployee() {
            // Arrange
            final Manager dummyManager = Dummies.getDummyManager();
            final List<Employee> dummyEmployees = Dummies.getDummyEmployees();
//            dummyManager.setEmployees(dummyEmployees);

            when(managerRepository.getByEmailIgnoreCase(any()))
                    .thenReturn(dummyManager);

            // Act
            final List<Employee> actualEmployees = managerService.getAllEmployee(dummyManager.getEmail());

            // Assert
            assertThat(actualEmployees)
                    .isEqualTo(dummyEmployees);
        }

        @Test
        @DisplayName("Should throw EntityNotFoundException when manager not found")
        public void shouldThrowIllegalArgumentException_whenManagerNotFound() {
            // Arrange
            final String emailManager = "random@email.com";
            when(managerRepository.getByEmailIgnoreCase(any()))
                    .thenReturn(null);

            // Act — Assert
            assertThrows(EntityNotFoundException.class,
                    () -> managerService.getAllEmployee(emailManager),
                    "Manager with email " + emailManager + " does not exist!");
        }
    }

    @Nested
    @DisplayName("addEmployee")
    class AddEmployeeTest {

        @Test
        @DisplayName("Should add employee to manager")
        public void shouldAddEmployeeToManager() {
            // Arrange
            final Manager dummyManager = Dummies.getDummyManager();
            final EmployeeDto dummyEmployeeDto = Dummies.getDummyEmployeeDto();
            final Employee employee = dummyEmployeeDto.mapToEmployee();

            when(managerRepository.getByEmailIgnoreCase(any()))
                    .thenReturn(dummyManager);
            when(employeeService.create(any()))
                    .thenReturn(employee);

            // Act
            final Employee actualEmployee = managerService.addEmployee(dummyManager.getEmail(), dummyEmployeeDto);

            // Assert
            assertThat(actualEmployee)
                    .isEqualTo(employee);
        }

        @Test
        @DisplayName("Should throw EntityNotFoundException when manager not found")
        public void shouldThrowEntityNotFoundException() {
            // Arrange
            final String emailManager = "random@email.com";
            when(managerRepository.getByEmailIgnoreCase(any()))
                    .thenReturn(null);

            // Act — Assert
            assertThrows(EntityNotFoundException.class,
                    () -> managerService.addEmployee(emailManager, Dummies.getDummyEmployeeDto()),
                    "Manager with email " + emailManager + " does not exist!");
        }

        @Test
        @DisplayName("Should throw IllegalArgumentException when employeeService throws exception")
        public void shouldThrowIllegalArgumentException() {
            // Arrange
            final Manager dummyManager = Dummies.getDummyManager();
            when(managerRepository.getByEmailIgnoreCase(any()))
                    .thenReturn(dummyManager);
            when(employeeService.create(any()))
                    .thenThrow(new IllegalArgumentException("Employee cannot be null!"));

            // Act — Assert
            assertThrows(IllegalArgumentException.class,
                    () -> managerService.addEmployee(dummyManager.getEmail(), null),
                    "Employee cannot be null!");
        }
    }

    @Nested
    @DisplayName("signIn")
    class SignInTests {
        @Test
        @DisplayName("should return manager")
        void shouldReturnManager() {
            // Arrange
            final Manager dummyManager = Dummies.getDummyManager();

            when(managerRepository.getByEmailIgnoreCaseAndPassword(any(), any()))
                    .thenReturn(dummyManager);
            // Act
            final var actualManager = managerService.signIn(new ConnectionDto(dummyManager.getEmail(), dummyManager.getPassword()));
            // Assert
            assertThat(actualManager)
                    .isEqualTo(dummyManager);
        }

        @Test
        @DisplayName("should throw IllegalArgumentException when dto is null")
        void shouldThrowIllegalArgumentException_whenDtoIsNull() {
            // Act — Assert
            assertThrows(IllegalArgumentException.class,
                    () -> managerService.signIn(null),
                    "Email and password cannot be null!");
        }

        @Test
        @DisplayName("should throw EntityNotFoundException when employee is not found")
        void shouldThrowEntityNotFoundException_whenDtoIsNull() {
            // Arrange
            when(managerRepository.getByEmailIgnoreCaseAndPassword(any(), any()))
                    .thenReturn(null);
            // Act — Assert
            assertThrows(EntityNotFoundException.class,
                    () -> managerService.signIn(new ConnectionDto("random@bertsa.ca", "password")),
                    "Invalid email or password!");
        }
    }
}