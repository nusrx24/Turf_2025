package com.example.turf.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
  private final Key key;
  private final long expirationMs;

  public JwtService(
      @Value("${app.jwt.secret:change-this-very-long-secret-key-256bits-min}") String secret,
      @Value("${app.jwt.expirationMillis:86400000}") long expirationMs) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes());
    this.expirationMs = expirationMs;
  }

  public String generate(String subject, Map<String, Object> claims) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .setSubject(subject)
        .addClaims(claims)
        .setIssuedAt(new Date(now))
        .setExpiration(new Date(now + expirationMs))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String username(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(token).getBody().getSubject();
  }

  public boolean isValid(String token) {
    try { Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token); return true; }
    catch (JwtException e) { return false; }
  }
}
