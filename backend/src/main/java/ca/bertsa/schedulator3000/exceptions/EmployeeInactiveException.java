package ca.bertsa.schedulator3000.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class EmployeeInactiveException extends RuntimeException {
    public EmployeeInactiveException(String s) {
        super(s);
    }
}
