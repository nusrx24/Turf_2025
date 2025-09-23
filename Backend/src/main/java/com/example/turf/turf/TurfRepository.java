package com.example.turf.turf;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TurfRepository extends JpaRepository<Turf, Long> {
  List<Turf> findBySportTypeIgnoreCaseAndActiveTrue(String sportType);
  List<Turf> findByActiveTrue();
  boolean existsByNameIgnoreCase(String name);
}
