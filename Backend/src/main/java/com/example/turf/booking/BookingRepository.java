package com.example.turf.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;

public interface BookingRepository extends JpaRepository<Booking, Long> {
  boolean existsByTurfIdAndBookingDateAndBookingTime(Long turfId, LocalDate date, String time);
}
