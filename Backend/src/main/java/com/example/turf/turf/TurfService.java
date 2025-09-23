package com.example.turf.turf;

import com.example.turf.booking.BookingRepository;
import com.example.turf.turf.dto.TurfDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service @RequiredArgsConstructor
public class TurfService {
  private final TurfRepository turfs;
  private final BookingRepository bookings;

  public List<String> getTurfTypes() {
    // derive distinct sport types from DB
    return turfs.findByActiveTrue().stream()
      .map(Turf::getSportType)
      .map(s -> s == null ? "" : s.trim())
      .filter(s -> !s.isEmpty())
      .map(s -> Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase())
      .distinct()
      .sorted()
      .toList();
  }

  /**
   * Return active turfs of the given sportType that are NOT booked at (date,time).
   */
  public List<TurfDTO> findAvailable(String sportType, LocalDate date, String timeSlot) {
    var candidates = turfs.findBySportTypeIgnoreCaseAndActiveTrue(sportType);
    return candidates.stream()
      .filter(t -> !bookings.existsByTurfIdAndBookingDateAndBookingTime(t.getId(), date, timeSlot))
      .map(TurfDTO::from)
      .toList();
  }

  public List<TurfDTO> allActive() {
    return turfs.findByActiveTrue().stream().map(TurfDTO::from).toList();
  }
}
