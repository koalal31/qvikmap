package com.qvikmap.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.qvikmap.demo.model.Shop;

public interface ShopRepository extends JpaRepository<Shop, Long> {

    // Spring generates the SQL from the method name:
    List<Shop> findByCityIgnoreCase(String city);

    // Custom geo query: shops within :radiusMeters of a point, nearest first.
    @Query(value = """
        SELECT * FROM shops
        WHERE ST_DWithin(location,
              ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radiusMeters)
        ORDER BY sponsor_tier DESC,
                 location <-> ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        """, nativeQuery = true)
    List<Shop> findNearby(@Param("lng") double lng, @Param("lat") double lat, @Param("radiusMeters") double radiusMeters);
}
