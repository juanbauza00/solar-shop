package com.solarshop.module.user.domain.repository;

import com.solarshop.module.user.domain.model.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionStatusRepository extends JpaRepository<SessionStatus, Long> {
    Optional<SessionStatus> findByName(String name);
}