package com.qvikmap.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.qvikmap.demo.model.ShopSubmission;

public interface ShopSubmissionRepository extends JpaRepository<ShopSubmission, Long> {
    List<ShopSubmission> findByStatusOrderByCreatedAtDesc(String status);
}
