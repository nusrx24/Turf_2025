package com.example.turf.security;

import com.example.turf.user.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.stream.Collectors;

public record UserPrincipal(User user) implements UserDetails {
  @Override public Collection<? extends GrantedAuthority> getAuthorities() {
    return user.getRoles().stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r.name())).collect(Collectors.toSet());
  }
  @Override public String getPassword() { return user.getPasswordHash(); }
  @Override public String getUsername() { return user.getEmail(); }
  @Override public boolean isAccountNonExpired() { return true; }
  @Override public boolean isAccountNonLocked() { return true; }
  @Override public boolean isCredentialsNonExpired() { return true; }
  @Override public boolean isEnabled() { return true; }
}
