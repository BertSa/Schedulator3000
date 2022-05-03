package ca.bertsa.schedulator3000.dtos;

import ca.bertsa.schedulator3000.models.Holiday;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Setter
@Getter
@EqualsAndHashCode
public class ManagerDto {
    private Long id;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String phone;
    @NotBlank
    private String companyName;
    private List<Holiday> holidays;
}
