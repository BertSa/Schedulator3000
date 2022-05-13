package ca.bertsa.schedulator3000.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "avail_seq", initialValue = 6)
public class Availabilities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "avail_seq")
    private Long id;
    @OneToOne
    @JsonIgnore
    private Employee employee;
    private LocalDateTime lastModified;
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "start", column = @Column(name = "sunday_start")),
            @AttributeOverride(name = "end", column = @Column(name = "sunday_end")),
    })
    private AvailabilityDay sunday = new AvailabilityDay();
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "start", column = @Column(name = "monday_start")),
            @AttributeOverride(name = "end", column = @Column(name = "monday_end")),
    })
    private AvailabilityDay monday = new AvailabilityDay();
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "start", column = @Column(name = "tuesday_start")),
            @AttributeOverride(name = "end", column = @Column(name = "tuesday_end")),
    })
    private AvailabilityDay tuesday = new AvailabilityDay();
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "start", column = @Column(name = "wednesday_start")),
            @AttributeOverride(name = "end", column = @Column(name = "wednesday_end")),
    })
    private AvailabilityDay wednesday = new AvailabilityDay();
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "start", column = @Column(name = "thursday_start")),
            @AttributeOverride(name = "end", column = @Column(name = "thursday_end")),
    })
    private AvailabilityDay thursday = new AvailabilityDay();
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "start", column = @Column(name = "friday_start")),
            @AttributeOverride(name = "end", column = @Column(name = "friday_end")),
    })
    private AvailabilityDay friday = new AvailabilityDay();
    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "start", column = @Column(name = "saturday_start")),
            @AttributeOverride(name = "end", column = @Column(name = "saturday_end")),
    })
    private AvailabilityDay saturday = new AvailabilityDay();
}

