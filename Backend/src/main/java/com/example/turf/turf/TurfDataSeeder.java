package com.example.turf.turf;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration @RequiredArgsConstructor
public class TurfDataSeeder {
  private final TurfRepository repo;

  @Bean
  CommandLineRunner seedTurfs() {
    return args -> {
      if (repo.count() > 0) return;

      // 1 turf for each sample sport in two areas
      // Central Area
add("Central Football A", "City Center", "Football", 3000);
add("Central Football B", "City Center", "Football", 3200);
add("Central Cricket A", "City Center", "Cricket", 3500);
add("Central Cricket B", "City Center", "Cricket", 3600);
add("Central Futsal A", "City Center", "Futsal", 2500);
add("Central Futsal B", "City Center", "Futsal", 2600);
add("Central Basketball A", "City Center", "Basketball", 2700);
add("Central Volleyball A", "City Center", "Volleyball", 2300);
add("Central Tennis A", "City Center", "Tennis", 2100);

// North Side
add("North Football A", "North Side", "Football", 2800);
add("North Football B", "North Side", "Football", 2900);
add("North Tennis A", "North Side", "Tennis", 2000);
add("North Badminton A", "North Side", "Badminton", 1500);
add("North Badminton B", "North Side", "Badminton", 1600);
add("North Hockey A", "North Side", "Hockey", 3300);
add("North Volleyball A", "North Side", "Volleyball", 2200);
add("North Swimming Pool A", "North Side", "Swimming", 4000);

// South Zone (new area)
add("South Football A", "South Zone", "Football", 3100);
add("South Cricket A", "South Zone", "Cricket", 3700);
add("South Cricket B", "South Zone", "Cricket", 3800);
add("South Futsal A", "South Zone", "Futsal", 2550);
add("South Tennis A", "South Zone", "Tennis", 2050);
add("South Basketball A", "South Zone", "Basketball", 2750);
add("South Volleyball A", "South Zone", "Volleyball", 2400);
add("South Badminton A", "South Zone", "Badminton", 1550);
add("South Swimming Pool A", "South Zone", "Swimming", 4200);

    };
  }

  private void add(String name, String area, String sport, Integer price) {
    if (!repo.existsByNameIgnoreCase(name)) {
      repo.save(Turf.builder()
        .name(name).area(area).sportType(sport).pricePerSlot(price).active(true).build());
    }
  }
}
