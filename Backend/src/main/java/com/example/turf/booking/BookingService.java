package com.example.turf.booking;

import com.example.turf.booking.dto.BookingRequest;
import com.example.turf.booking.dto.BookingResponse;
import com.example.turf.turf.Turf;
import com.example.turf.turf.TurfRepository;
import com.example.turf.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class BookingService {
  private final BookingRepository bookings;
  private final TurfRepository turfs;
  private final UserRepository users;

  @Transactional
  public BookingResponse book(Long turfId, Long userId, BookingRequest req) {
    Turf turf = turfs.findById(turfId).orElseThrow(() -> new IllegalArgumentException("Turf not found"));
    var user = users.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

    // Prevent double-booking
    if (bookings.existsByTurfIdAndBookingDateAndBookingTime(turfId, req.bookingDate(), req.timeslot())) {
      throw new IllegalStateException("This turf is already booked for that slot");
    }

    var booking = Booking.builder()
        .turf(turf)
        .user(user)
        .bookingDate(req.bookingDate())
        .bookingTime(req.timeslot())
        .status(BookingStatus.BOOKED)
        .confirmationCode(UUID.randomUUID().toString())
        .createdAt(Instant.now())
        .build();

    var saved = bookings.save(booking);
    return new BookingResponse(200, saved.getId(), saved.getConfirmationCode());
  }
}
