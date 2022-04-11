package ca.bertsa.schedulator3000.exceptions;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

public class EmployeeInactiveException extends Exception {
    public EmployeeInactiveException(String s) {
        super(s);
    }
}
