package ca.bertsa.schedulator3000.controllers;

import ca.bertsa.schedulator3000.dtos.ConnectionDto;
import ca.bertsa.schedulator3000.models.Employee;
import ca.bertsa.schedulator3000.services.EmployeeService;
import ca.bertsa.schedulator3000.utils.Dummies;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTests {

    private final ObjectMapper MAPPER = new ObjectMapper();
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private EmployeeService employeeService;

    @Nested
    @DisplayName("POST /api/employee/signin/")
    class SignInTests {

        @Test
        @DisplayName("should return employee when signIn is successful")
        public void shouldReturnEmployee() throws Exception {
            // Arrange
            final Employee dummyEmployee = Dummies.getDummyEmployee(1L);

            when(employeeService.signIn(any()))
                    .thenReturn(dummyEmployee);

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .post("/api/employee/signin/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(MAPPER.writeValueAsString(
                                    new ConnectionDto(dummyEmployee.getEmail(), dummyEmployee.getPassword()))))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();
            var actualEmployee = MAPPER.readValue(response.getContentAsString(), Employee.class);

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.OK.value());
            assertThat(actualEmployee)
                    .isEqualTo(dummyEmployee);
        }

        @Test
        @DisplayName("should return error message when signIn is unsuccessful")
        public void shouldReturnError_whenSignInThrowException() throws Exception {
            // Arrange
            when(employeeService.signIn(any()))
                    .thenThrow(new EntityNotFoundException("Employee not found!"));

            // Act
            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                            .post("/api/employee/signin/")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(MAPPER.writeValueAsString(
                                    new ConnectionDto("random@bertsa.ca", "password"))))
                    .andReturn();

            // Assert
            final MockHttpServletResponse response = mvcResult.getResponse();

            assertThat(response.getStatus())
                    .isEqualTo(HttpStatus.BAD_REQUEST.value());
            assertThat(response.getContentAsString())
                    .contains("Employee not found!");
        }
    }
}
