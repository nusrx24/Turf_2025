package com.example.turf.turf.dto;

import com.example.turf.turf.Turf;

public record TurfDTO(Long id, String name, String area, String sportType, Integer pricePerSlot) {
  public static TurfDTO from(Turf t) {
    return new TurfDTO(t.getId(), t.getName(), t.getArea(), t.getSportType(), t.getPricePerSlot());
  }
}
