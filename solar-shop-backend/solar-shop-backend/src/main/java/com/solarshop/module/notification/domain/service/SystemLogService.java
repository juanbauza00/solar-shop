package com.solarshop.module.notification.domain.service;

import com.solarshop.module.notification.api.dto.SystemLogDto;
import com.solarshop.module.notification.domain.model.SystemLog;
import com.solarshop.module.notification.domain.repository.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SystemLogService {

    private final SystemLogRepository systemLogRepository;

    public Page<SystemLogDto> getLogs(Pageable pageable) {
        return systemLogRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    public Page<SystemLogDto> getLogsByLevel(String level, Pageable pageable) {
        return systemLogRepository.findByLevel(level.toUpperCase(), pageable)
                .map(this::mapToDto);
    }

    public Page<SystemLogDto> getLogsByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return systemLogRepository.findByTimestampBetween(start, end, pageable)
                .map(this::mapToDto);
    }

    private SystemLogDto mapToDto(SystemLog log) {
        return SystemLogDto.builder()
                .id(log.getId())
                .timestamp(log.getTimestamp())
                .level(log.getLevel())
                .message(log.getMessage())
                .userId(log.getUserId())
                .exceptionDetails(log.getExceptionDetails())
                .additionalData(log.getAdditionalData())
                .build();
    }
}