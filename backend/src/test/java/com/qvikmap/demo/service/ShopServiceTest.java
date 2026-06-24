package com.qvikmap.demo.service;

import com.qvikmap.demo.dto.ShopDto;
import com.qvikmap.demo.model.Shop;
import com.qvikmap.demo.repository.ShopRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock
    ShopRepository repository;

    @InjectMocks
    ShopService service;

    private static final GeometryFactory GF = new GeometryFactory();

    private Shop shop(long id, String name, String type, double lat, double lng) {
        Shop s = new Shop();
        s.setId(id);
        s.setName(name);
        s.setType(type);
        s.setLocation(GF.createPoint(new Coordinate(lng, lat))); // Coordinate(x=lng, y=lat)
        return s;
    }

    @Test
    void searchWithNoFiltersReturnsMappedDtos() {
        when(repository.findAll()).thenReturn(List.of(
                shop(1L, "CBA Budapest", "GROCERY", 47.49, 19.04)
        ));

        List<ShopDto> result = service.search(null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("CBA Budapest");
        assertThat(result.get(0).lat()).isEqualTo(47.49);
        assertThat(result.get(0).lng()).isEqualTo(19.04);
    }

    @Test
    void searchWithTypeFilterExcludesNonMatchingShops() {
        when(repository.findAll()).thenReturn(List.of(
                shop(1L, "CBA Budapest", "GROCERY", 47.49, 19.04),
                shop(2L, "Pékség Fő u.", "BAKERY", 47.50, 19.05)
        ));

        List<ShopDto> result = service.search(null, "BAKERY");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Pékség Fő u.");
    }

    @Test
    void getByIdThrows404ForUnknownShop() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getById(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404");
    }
}
