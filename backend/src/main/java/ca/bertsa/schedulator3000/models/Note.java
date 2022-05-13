package ca.bertsa.schedulator3000.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private LocalDateTime lastModified;
    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Employee employee;
}
