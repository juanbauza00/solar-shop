package com.solarshop.module.notification.api.controller;

import com.solarshop.module.notification.api.dto.SystemLogDto;
import com.solarshop.module.notification.domain.service.SystemLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Logs", description = "API para consulta de logs del sistema")
public class NotificationController {

    private final SystemLogService systemLogService;

    @GetMapping
    @Operation(summary = "Obtener todos los logs", description = "Retorna una lista paginada de logs del sistema")
    public ResponseEntity<Page<SystemLogDto>> getLogs(Pageable pageable) {
        return ResponseEntity.ok(systemLogService.getLogs(pageable));
    }

    @GetMapping("/level/{level}")
    @Operation(summary = "Obtener logs por nivel", description = "Retorna logs filtrados por nivel (INFO, WARN, ERROR, etc.)")
    public ResponseEntity<Page<SystemLogDto>> getLogsByLevel(
            @PathVariable String level,
            Pageable pageable) {
        return ResponseEntity.ok(systemLogService.getLogsByLevel(level, pageable));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Obtener logs por rango de fechas", description = "Retorna logs dentro de un rango de fechas")
    public ResponseEntity<Page<SystemLogDto>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            Pageable pageable) {
        return ResponseEntity.ok(systemLogService.getLogsByDateRange(start, end, pageable));
    }
}