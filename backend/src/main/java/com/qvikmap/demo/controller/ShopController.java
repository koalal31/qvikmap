package com.qvikmap.demo.controller;

import com.qvikmap.demo.dto.ShopDto;
import com.qvikmap.demo.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService service;

    @GetMapping
    public List<ShopDto> list(@RequestParam(required = false) String city,
                              @RequestParam(required = false) String type) {
        return service.search(city, type);
    }

    @GetMapping("/nearby")
    public List<ShopDto> nearby(@RequestParam double lat,
                                @RequestParam double lng,
                                @RequestParam(defaultValue = "2000") double radius) {
        return service.nearby(lat, lng, radius);
    }

    @GetMapping("/{id}")
    public ShopDto get(@PathVariable Long id) {
        return service.getById(id);
    }
}
