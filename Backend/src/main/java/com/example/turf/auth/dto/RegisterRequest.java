package com.example.turf.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
  @NotBlank private String fullName;
  @Email @NotBlank private String email;
  @Size(min=6) private String password;
}
