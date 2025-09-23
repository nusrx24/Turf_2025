package com.example.turf.turf;

import com.example.turf.turf.dto.TurfDTO;
import com.example.turf.turf.dto.TurfSearchResponse;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController @RequestMapping("/api/turfs") @RequiredArgsConstructor
public class TurfController {
  private final TurfService service;

  @GetMapping("/types")
  public List<String> types() {
    return service.getTurfTypes();
  }

  /** Your UI calls /turfs/available-turfs-by-date-and-type?bookingDate=YYYY-MM-DD&bookingTime=HH:mm-HH:mm&turfType=Football */
  @GetMapping("/available-turfs-by-date-and-type")
  public ResponseEntity<TurfSearchResponse> available(
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate bookingDate,
      @RequestParam @NotBlank String bookingTime,
      @RequestParam @NotBlank String turfType) {

    var list = service.findAvailable(turfType, bookingDate, bookingTime);
    return ResponseEntity.ok(new TurfSearchResponse(200, list));
  }

  /** Your UI also calls /turfs/all and /turfs/all-available-turfs (we'll return all active for both) */
  @GetMapping("/all")
  public List<TurfDTO> all() {
    return service.allActive();
  }

  @GetMapping("/all-available-turfs")
  public List<TurfDTO> allAvailable() {
    return service.allActive();
  }

  @GetMapping("/turf-by-id/{id}")
  public ResponseEntity<TurfDTO> byId(@PathVariable Long id) {
    return service.allActive().stream().filter(t -> t.id().equals(id))
      .findFirst().map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }
}
