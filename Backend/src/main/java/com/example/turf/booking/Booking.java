package com.example.turf.booking;

import com.example.turf.turf.Turf;
import com.example.turf.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
  name = "bookings",
  uniqueConstraints = @UniqueConstraint(
    name = "uk_turf_date_time",
    columnNames = {"turf_id", "booking_date", "booking_time"}
  ),
  indexes = {
    @Index(name="idx_booking_turf_date", columnList="turf_id, booking_date")
  }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional=false, fetch = FetchType.LAZY)
  @JoinColumn(name="turf_id")
  private Turf turf;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name="user_id")
  private User user;

  @NotNull
  @Column(name="booking_date", nullable=false)
  private LocalDate bookingDate;

  /** Slot string: e.g. "06:00-08:00" */
  @NotBlank
  @Column(name="booking_time", nullable=false, length=20)
  private String bookingTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable=false, length=20)
  private BookingStatus status;

  @Column(nullable=false, unique=true, length=36)
  private String confirmationCode;

  @Column(nullable=false)
  private Instant createdAt;
}
