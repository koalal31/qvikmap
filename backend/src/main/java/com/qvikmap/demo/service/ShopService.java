package com.qvikmap.demo.service;

import com.qvikmap.demo.dto.ShopDto;
import com.qvikmap.demo.model.Shop;
import com.qvikmap.demo.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository repository;

    public List<ShopDto> search(String city, String type) {
        List<Shop> shops = city != null
                ? repository.findByCityIgnoreCase(city)
                : repository.findAll();

        if (type != null) {
            shops = shops.stream()
                    .filter(s -> s.getType().equalsIgnoreCase(type))
                    .toList();
        }

        return shops.stream().map(this::toDto).toList();
    }

    public List<ShopDto> nearby(double lat, double lng, double radiusMeters) {
        return repository.findNearby(lng, lat, radiusMeters)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ShopDto getById(Long id) {
        Shop shop = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(shop);
    }

    private ShopDto toDto(Shop s) {
        return new ShopDto(
                s.getId(),
                s.getName(),
                s.getType(),
                s.getAddress(),
                s.getCity(),
                s.getPostalCode(),
                s.getLocation().getY(),
                s.getLocation().getX(),
                s.isQvikVerified(),
                s.isSponsored(),
                s.getSponsorTier(),
                s.getWebsite()
        );
    }
}
