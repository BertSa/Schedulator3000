//package ca.bertsa.schedulator3000.controllers;
//
//import ca.bertsa.schedulator3000.dto.RequestScheduleEmployeeDto;
//import ca.bertsa.schedulator3000.services.ShiftService;
//import ca.bertsa.schedulator3000.utils.Dummies;
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Nested;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockHttpServletResponse;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.MvcResult;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//
//import javax.persistence.EntityNotFoundException;
//import java.time.LocalDate;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//
//@WebMvcTest(ScheduleController.class)
//class ScheduleControllerTests {
//
//    private final ObjectMapper MAPPER = new ObjectMapper()
//            .registerModule(new JavaTimeModule());
//    @Autowired
//    private MockMvc mockMvc;
//    @MockBean
//    private ShiftService shiftService;
//
//    @Nested
//    @DisplayName("GET /api/schedule/weekof/{weekNumber}")
//    class GetScheduleByWeekTests {
//
//        @Test
//        @DisplayName("should return list of employees when getAllEmployeeOfManager is successful")
//        public void shouldReturnScheduleOfWeek() throws Exception {
//            // Arrange
//            final ScheduleDto dummyScheduleDto = Dummies.getDummySchedule().mapToDto();
//
//            when(shiftService.getScheduleFromWeekFirstDay(any()))
//                    .thenReturn(dummyScheduleDto);
//
//            // Act
//            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
//                            .get("/api/schedule/weekof/{weekNumber}", LocalDate.now().toString())
//                            .contentType(MediaType.APPLICATION_JSON))
//                    .andReturn();
//
//            // Assert
//            final MockHttpServletResponse response = mvcResult.getResponse();
//            var actualSchedule = MAPPER.readValue(response.getContentAsString(), new TypeReference<ScheduleDto>() {
//            });
//
//            assertThat(response.getStatus())
//                    .isEqualTo(HttpStatus.OK.value());
//            assertThat(actualSchedule)
//                    .isEqualTo(dummyScheduleDto);
//        }
//
//        @Test
//        @DisplayName("should return list of employees when getAllEmployeeOfManager is successful")
//        public void shouldReturnBadRequest_whenServiceThrowException() throws Exception {
//            // Arrange
//            when(shiftService.getScheduleFromWeekFirstDay(any()))
//                    .thenThrow(new EntityNotFoundException("Schedule not found!"));
//
//            // Act
//            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
//                            .get("/api/schedule/weekof/{weekNumber}", LocalDate.now().toString())
//                            .contentType(MediaType.APPLICATION_JSON))
//                    .andReturn();
//
//            // Assert
//            final MockHttpServletResponse response = mvcResult.getResponse();
//
//            assertThat(response.getStatus())
//                    .isEqualTo(HttpStatus.BAD_REQUEST.value());
//            assertThat(response.getContentAsString())
//                    .contains("Schedule not found!");
//        }
//    }
//
//    @Nested
//    @DisplayName("GET /api/schedule/employee/weekof/")
//    class GetScheduleByEmployeeTests {
//
//        @Test
//        @DisplayName("should return list of employees when getAllEmployeeOfManager is successful")
//        public void shouldReturnScheduleOfWeek() throws Exception {
//            // Arrange
//            final RequestScheduleEmployeeDto dummyScheduleEmployee = Dummies.getDummyScheduleEmployee();
//            final ScheduleDto dummyScheduleDto = Dummies.getDummySchedule().mapToDto();
//
//            when(shiftService.getScheduleOfEmployee(any()))
//                    .thenReturn(dummyScheduleDto);
//
//            // Act
//            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
//                            .get("/api/schedule/employee/weekof/")
//                            .contentType(MediaType.APPLICATION_JSON)
//                            .content(MAPPER.writeValueAsString(dummyScheduleEmployee)))
//                    .andReturn();
//
//            // Assert
//            final MockHttpServletResponse response = mvcResult.getResponse();
//            var actualSchedule = MAPPER.readValue(response.getContentAsString(), new TypeReference<ScheduleDto>() {
//            });
//
//            assertThat(response.getStatus())
//                    .isEqualTo(HttpStatus.OK.value());
//            assertThat(actualSchedule)
//                    .isEqualTo(dummyScheduleDto);
//        }
//
//        @Test
//        public void shouldReturnBadRequest_whenServiceThrowException() throws Exception {
//            // Arrange
//            final RequestScheduleEmployeeDto dummyScheduleEmployee = Dummies.getDummyScheduleEmployee();
//
//            when(shiftService.getScheduleOfEmployee(any()))
//                    .thenThrow(new EntityNotFoundException("Schedule not found!"));
//
//            // Act
//            MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
//                            .get("/api/schedule/employee/weekof/")
//                            .contentType(MediaType.APPLICATION_JSON)
//                            .content(MAPPER.writeValueAsString(dummyScheduleEmployee)))
//                    .andReturn();
//
//            // Assert
//            final MockHttpServletResponse response = mvcResult.getResponse();
//
//            assertThat(response.getStatus())
//                    .isEqualTo(HttpStatus.BAD_REQUEST.value());
//            assertThat(response.getContentAsString())
//                    .contains("Schedule not found!");
//        }
//    }
//}