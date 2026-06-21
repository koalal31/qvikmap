package com.qvikmap.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record SubmissionRequestDto(
    @NotBlank String name,
    String type,
    String address,
    @NotBlank String city,
    String postalCode,
    String website,
    String note,
    Double lat,
    Double lng,
    boolean qvikVerified
) {}
