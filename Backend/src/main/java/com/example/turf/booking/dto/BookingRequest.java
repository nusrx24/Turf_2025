package com.example.turf.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record BookingRequest(
  @NotNull LocalDate bookingDate,
  @NotBlank String timeslot
) {}
