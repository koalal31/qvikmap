package com.qvikmap.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "shops")
@Getter
@Setter
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    private String address;
    private String city;
    private String postalCode;

    @Column(columnDefinition = "geography(Point,4326)", nullable = false)
    private Point location;

    private boolean qvikVerified;
    private boolean sponsored;
    private int sponsorTier;
    private String website;
    private String source;
}
