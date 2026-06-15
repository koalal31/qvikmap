package com.qvikmap.demo.controller;

import com.qvikmap.demo.dto.ShopDto;
import com.qvikmap.demo.service.ShopService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ShopController.class)
class ShopControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ShopService service;

    @Test
    void listReturnsEmptyArrayWhenNoShops() throws Exception {
        when(service.search(null, null)).thenReturn(List.of());

        mockMvc.perform(get("/api/shops"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void listReturnsShopFromService() throws Exception {
        ShopDto shop = new ShopDto(1L, "Pékség", "BAKERY", "Fő u. 1", "Budapest",
                "1011", 47.49, 19.04, true, false, 0, null);
        when(service.search(null, null)).thenReturn(List.of(shop));

        mockMvc.perform(get("/api/shops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Pékség"))
                .andExpect(jsonPath("$[0].type").value("BAKERY"));
    }
}
