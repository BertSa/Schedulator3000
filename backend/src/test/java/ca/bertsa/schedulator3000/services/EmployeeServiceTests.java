package ca.bertsa.schedulator3000.services;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.dtos.EmployeeDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.repositories.EmployeeRepository;
import ca.bertsa.schedulator3000.utils.Dummies;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import javax.persistence.EntityNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTests {

    @InjectMocks
    private EmployeeService employeeService;

    @Mock
    private EmployeeRepository employeeRepository;


    @Nested
    @DisplayName("create")
    class CreateTests {
        @Test
        @DisplayName("should create employee")
        void shouldCreateEmployee() {
            // Arrange
            final EmployeeDto dummyEmployeeDto = Dummies.getDummyEmployeeDto();

            when(employeeRepository.existsByEmailIgnoreCase(any()))
                    .thenReturn(false);
            final Employee mappedEmployee = dummyEmployeeDto.mapToEmployee();
            when(employeeRepository.save(any()))
                    .thenReturn(mappedEmployee);

            // Act
            final Employee actualEmployee = employeeService.create(dummyEmployeeDto);

            // Assert
            assertThat(actualEmployee)
                    .isEqualTo(mappedEmployee);
        }

        @Test
        @DisplayName("should throw exception when employee already exists")
        void shouldThrowIllegalArgumentException_whenEmailAlreadyUsed() {
            // Arrange
            final EmployeeDto dummyEmployeeDto = Dummies.getDummyEmployeeDto();

            when(employeeRepository.existsByEmailIgnoreCase(any()))
                    .thenReturn(true);

            // Act — Assert
            assertThrows(IllegalArgumentException.class,
                    () -> employeeService.create(dummyEmployeeDto),
                    "Employee with email " + dummyEmployeeDto.getEmail() + " already exists!");
        }

        @Test
        @DisplayName("should throw exception when employeeDto is null")
        void shouldThrowIllegalArgumentException_whenEmployeeDtoIsNull() {
            // Act — Assert
            assertThrows(IllegalArgumentException.class,
                    () -> employeeService.create(null),
                    "Employee cannot be null!");
        }
    }

    @Nested
    @DisplayName("signIn")
    class SignInTests {
        @Test
        @DisplayName("should return employee")
        void shouldReturnEmployee() {
            // Arrange
            final Employee dummyEmployee = Dummies.getDummyEmployee(1L);

            when(employeeRepository.getByEmailIgnoreCaseAndPassword(any(), any()))
                    .thenReturn(dummyEmployee);
            // Act
            final Employee actualEmployee = employeeService.signIn(new ConnectionDto(dummyEmployee.getEmail(), dummyEmployee.getPassword()));
            // Assert
            assertThat(actualEmployee)
                    .isEqualTo(dummyEmployee);
        }

        @Test
        @DisplayName("should throw IllegalArgumentException when dto is null")
        void shouldThrowIllegalArgumentException_whenDtoIsNull() {
            // Act — Assert
            assertThrows(IllegalArgumentException.class,
                    () -> employeeService.signIn(null),
                    "Email and password cannot be null!");
        }

        @Test
        @DisplayName("should throw EntityNotFoundException when employee is not found")
        void shouldThrowEntityNotFoundException_whenDtoIsNull() {
            // Arrange
            when(employeeRepository.getByEmailIgnoreCaseAndPassword(any(), any()))
                    .thenReturn(null);
            // Act — Assert
            assertThrows(EntityNotFoundException.class,
                    () -> employeeService.signIn(new ConnectionDto("random@bertsa.ca", "password")),
                    "Invalid email or password!");
        }
    }
}