package com.example.turf.auth;

import com.example.turf.auth.dto.*;
import com.example.turf.security.JwtService;
import com.example.turf.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Map;
  import java.util.Set;

@Service @RequiredArgsConstructor
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;

  public void register(RegisterRequest r) {
    if (users.existsByEmail(r.getEmail())) throw new IllegalArgumentException("Email already in use");
    var user = User.builder()
        .fullName(r.getFullName())
        .email(r.getEmail())
        .passwordHash(encoder.encode(r.getPassword()))
        .roles(Set.of(Role.USER))
        .createdAt(Instant.now())
        .build();
    users.save(user);
  }

  public String login(AuthRequest req) {
    var user = users.findByEmail(req.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    if (!encoder.matches(req.getPassword(), user.getPasswordHash())) throw new IllegalArgumentException("Invalid credentials");
    return jwt.generate(user.getEmail(), Map.of("roles", user.getRoles()));
  }
}
