package com.qvikmap.demo.controller;

import com.qvikmap.demo.model.ShopSubmission;
import com.qvikmap.demo.service.ShopSubmissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ShopSubmissionController.class)
class ShopSubmissionControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ShopSubmissionService service;

    @Test
    void validSubmissionReturns202() throws Exception {
        when(service.submit(any(), any())).thenReturn(new ShopSubmission());

        mockMvc.perform(post("/api/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Test Shop","city":"Budapest","qvikVerified":false}
                                """))
                .andExpect(status().isAccepted());
    }

    @Test
    void blankRequiredFieldsReturn400() throws Exception {
        mockMvc.perform(post("/api/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","city":""}
                                """))
                .andExpect(status().isBadRequest());
    }
}
