package com.example.turf.turf.dto;

import java.util.List;

public record TurfSearchResponse(int statusCode, List<TurfDTO> turfList) {}
