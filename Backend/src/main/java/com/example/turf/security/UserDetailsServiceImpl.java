package com.example.turf.security;

import com.example.turf.user.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
  private final UserRepository repo;
  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    var user = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Not found"));
    return new UserPrincipal(user);
  }
}
