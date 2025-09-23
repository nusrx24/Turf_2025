package com.example.turf.auth;

import com.example.turf.auth.dto.RegisterRequest;
import com.example.turf.user.User;
import com.example.turf.user.UserRepository;
import com.example.turf.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceRegisterTest {

    @Test
    public void testRegisterUser_Success() {
        // RED PHASE - This test will fail first, but we'll make it pass

        // Setup
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtService jwtService = mock(JwtService.class);

        AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        // Mock behavior
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L); // Simulate saved user with ID
            return user;
        });

        // GREEN PHASE - This should pass
        assertDoesNotThrow(() -> authService.register(request));

        // Verify the save was called
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testRegisterUser_EmailAlreadyExists() {
        // RED PHASE - This test will fail first

        // Setup
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtService jwtService = mock(JwtService.class);

        AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        // Mock email already exists
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // GREEN PHASE - This should pass (throw exception as expected)
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.register(request);
        });

        assertEquals("Email already in use", exception.getMessage());
    }
}