package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.dtos.EmployeeDto;
import ca.bertsa.schedulator3000.dtos.ManagerDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.models.Manager;
import ca.bertsa.schedulator3000.services.ManagerService;
import ca.bertsa.schedulator3000.utils.Dummies;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import javax.persistence.EntityNotFoundException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(ManagerController.class)
public class ManagerControllerTest {
    private final ObjectMapper MAPPER = new ObjectMapper();
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ManagerService managerService;

    @Nested
    @DisplayName("POST /api/manager/signin/")
    class SignInTests {

        @Test
        @DisplayName("should return manager when signIn is successful")
        public void shouldReturnManager() throws Exception {
            // Arrange
            final ManagerDto dummyManagerDto = Dummies.getDummyManager().mapToDto();

            when(managerService.signIn(any()))
                    .thenReturn(dummyManagerDto);

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .post("/api/manager/signin/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(MAPPER.writeValueAsString(
                                    new ConnectionDto(dummyManagerDto.getEmail(), dummyManagerDto.getPassword()))))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();
            var actualManager = MAPPER.readValue(response.getContentAsString(), ManagerDto.class);

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.OK.value());
            assertThat(actualManager)
                    .isEqualTo(dummyManagerDto);
        }

        @Test
        @DisplayName("should return error message when signIn is unsuccessful")
        public void shouldReturnError_whenSignInThrowException() throws Exception {
            // Arrange
            when(managerService.signIn(any()))
                    .thenThrow(new EntityNotFoundException("Manager not found!"));

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .post("/api/manager/signin/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(MAPPER.writeValueAsString(
                                    new ConnectionDto("random@bertsa.ca", "password"))))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value());
            assertThat(response.getContentAsString())
                    .contains("Manager not found!");
        }
    }

    @Nested
    @DisplayName("POST /api/manager/employees/add/{emailManager}")
    class AddEmployeeTests {

        @Test
        @DisplayName("should return employee when addEmployee is successful")
        public void shouldAddEmployee() throws Exception {
            // Arrange
            final Manager manager = Dummies.getDummyManager();
            final EmployeeDto dummyEmployee = Dummies.getDummyEmployeeDto();
            final Employee employee = dummyEmployee.mapToEmployee();
            employee.setId(2L);

            when(managerService.createEmployee(any(), any()))
                    .thenReturn(employee);

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .post("/api/manager/employees/add/{emailManager}", manager.getEmail())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(MAPPER.writeValueAsString(dummyEmployee)))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();
            var actualEmployee = MAPPER.readValue(response.getContentAsString(), Employee.class);

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.CREATED.value());
            assertThat(actualEmployee)
                    .isEqualTo(employee);
        }

        @Test
        @DisplayName("should return error message when addEmployee is unsuccessful")
        public void shouldReturnBadRequest_whenServiceThrowException() throws Exception {
            // Arrange
            final EmployeeDto dummyEmployee = Dummies.getDummyEmployeeDto();
            final Employee employee = dummyEmployee.mapToEmployee();
            employee.setId(2L);

            when(managerService.createEmployee(any(), any()))
                    .thenThrow(new IllegalArgumentException("Manager does not exist!"));

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .post("/api/manager/employees/add/{emailManager}", "randomEmail@email.com")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(MAPPER.writeValueAsString(dummyEmployee)))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value());
            assertThat(response.getContentAsString())
                    .contains("Manager does not exist!");
        }
    }

    @Nested
    @DisplayName("GET /api/manager/employees/{emailManager}")
    class GetAllEmployeeOfManagerTests {

        @Test
        @DisplayName("should return list of employees when getAllEmployeeOfManager is successful")
        public void shouldReturnListOfEmployee() throws Exception {
            // Arrange
            final List<Employee> dummyEmployees = Dummies.getDummyEmployees();

            when(managerService.getAllEmployee(any()))
                    .thenReturn(dummyEmployees);

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .get("/api/manager/employees/{emailManager}", "manager@bertsa.ca")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();
            var actualEmployees = MAPPER.readValue(response.getContentAsString(), new TypeReference<List<Employee>>() {
            });

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.OK.value());
            assertThat(actualEmployees)
                    .isEqualTo(dummyEmployees);
        }

        @Test
        @DisplayName("should return error message when getAllEmployeeOfManager is unsuccessful")
        public void shouldReturnBadRequest_whenServiceThrowException() throws Exception {
            // Arrange
            when(managerService.getAllEmployee(any()))
                    .thenThrow(new EntityNotFoundException("Manager does not exist!"));

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .get("/api/manager/employees/{emailManager}", "manager@bertsa.ca")
                            .contentType(MediaType.APPLICATION_JSON))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value());
            assertThat(response.getContentAsString())
                    .contains("Manager does not exist!");
        }
    }
}