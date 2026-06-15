package com.qvikmap.demo.dto;

public record ShopDto(
        Long id,
        String name,
        String type,
        String address,
        String city,
        String postalCode,
        double lat,
        double lng,
        boolean qvikVerified,
        boolean sponsored,
        int sponsorTier,
        String website
) {}
