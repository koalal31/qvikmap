package com.qvikmap.demo.controller;

import com.qvikmap.demo.dto.ShopDto;
import com.qvikmap.demo.dto.SubmissionRequestDto;
import com.qvikmap.demo.service.ShopService;
import com.qvikmap.demo.service.ShopSubmissionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class ShopSubmissionController {
    private final ShopSubmissionService service;

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void submit(
            @Valid @RequestBody SubmissionRequestDto dto,
            HttpServletRequest request) {
        service.submit(dto, request.getRemoteAddr());
    }
    
}
