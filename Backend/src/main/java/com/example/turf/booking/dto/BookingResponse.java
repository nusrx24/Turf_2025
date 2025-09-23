package com.example.turf.booking.dto;

public record BookingResponse(int statusCode, Long bookingId, String confirmationCode) {}
