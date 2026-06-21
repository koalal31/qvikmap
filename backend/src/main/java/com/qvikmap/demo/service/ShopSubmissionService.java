package com.qvikmap.demo.service;

import com.qvikmap.demo.dto.ShopDto;
import com.qvikmap.demo.dto.SubmissionRequestDto;
import com.qvikmap.demo.model.Shop;
import com.qvikmap.demo.model.ShopSubmission;
import com.qvikmap.demo.repository.ShopRepository;
import com.qvikmap.demo.repository.ShopSubmissionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopSubmissionService {
    private final ShopSubmissionRepository repository;

    public ShopSubmission submit(SubmissionRequestDto dto, String submitterIp) {
        ShopSubmission sub = new ShopSubmission();
        sub.setName(dto.name());
        sub.setType(dto.type());
        sub.setAddress(dto.address());
        sub.setCity(dto.city());
        sub.setWebsite(dto.website());
        sub.setNote(dto.note());
        sub.setLat(dto.lat());
        sub.setLng(dto.lng());
        sub.setQvikVerified(dto.qvikVerified());
        sub.setSubmitterIp(submitterIp);
        return repository.save(sub);
    }
    
}
