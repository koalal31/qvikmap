package com.qvikmap.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "shop_submissions")
@Getter @Setter
public class ShopSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type, address, city, postalCode, website, note;
    private Double lat, lng;
    private String submitterIp;
    private boolean qvikVerified;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(nullable = false)
    private java.time.OffsetDateTime createdAt = java.time.OffsetDateTime.now();

    private java.time.OffsetDateTime reviewedAt;
    
}
