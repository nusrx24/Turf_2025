package com.example.turf.booking;

import com.example.turf.booking.dto.BookingRequest;
import com.example.turf.booking.dto.BookingResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/bookings") @RequiredArgsConstructor
public class BookingController {
  private final BookingService service;

  // Matches ApiService.bookTurf(turfId, userId, booking)
  @PostMapping("/book-turf/{turfId}/{userId}")
  public ResponseEntity<BookingResponse> book(
      @PathVariable Long turfId,
      @PathVariable Long userId,
      @Valid @RequestBody BookingRequest req) {
    var resp = service.book(turfId, userId, req);
    return ResponseEntity.ok(resp);
  }
}
