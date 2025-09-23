package com.example.turf.turf;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity @Table(name="turfs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Turf {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank @Column(nullable=false, unique=true)
  private String name;

  /** City/area/region */
  @NotBlank @Column(nullable=false)
  private String area;

  /** e.g., Football, Cricket, Futsal, ... */
  @NotBlank @Column(nullable=false)
  private String sportType;

  /** Simple numeric price per slot/hour (optional) */
  private Integer pricePerSlot;

  /** If turf is active/visible for booking */
  @Builder.Default
  private boolean active = true;
}
