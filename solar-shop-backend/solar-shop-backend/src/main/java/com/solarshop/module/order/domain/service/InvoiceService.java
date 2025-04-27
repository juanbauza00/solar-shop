package com.solarshop.module.order.domain.service;

import com.solarshop.module.order.domain.model.Invoice;
import com.solarshop.module.order.domain.model.InvoiceStatus;
import com.solarshop.module.order.domain.model.InvoiceType;
import com.solarshop.module.order.domain.model.Sale;
import com.solarshop.module.order.domain.repository.InvoiceRepository;
import com.solarshop.module.order.domain.repository.InvoiceStatusRepository;
import com.solarshop.module.order.domain.repository.InvoiceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceTypeRepository invoiceTypeRepository;
    private final InvoiceStatusRepository invoiceStatusRepository;

    @Transactional
    public Invoice generateInvoice(Sale sale) {
        // Generar número de factura único
        String invoiceNumber = generateInvoiceNumber(sale);

        // Obtener tipo y estado de factura por defecto
        InvoiceType invoiceType = invoiceTypeRepository.findByName("FACTURA")
                .orElseThrow(() -> new RuntimeException("Tipo de factura 'FACTURA' no encontrado"));

        InvoiceStatus invoiceStatus = invoiceStatusRepository.findByName("PENDIENTE")
                .orElseThrow(() -> new RuntimeException("Estado de factura 'PENDIENTE' no encontrado"));

        // Calcular subtotal
        BigDecimal subtotal = sale.calculateSubtotal();

        // Calcular impuestos (21% IVA por ejemplo)
        BigDecimal taxRate = new BigDecimal("0.21");
        BigDecimal taxes = subtotal.multiply(taxRate);

        // Calcular total
        BigDecimal total = subtotal.add(taxes);

        // Crear factura
        Invoice invoice = Invoice.builder()
                .sale(sale)
                .invoiceNumber(invoiceNumber)
                .invoiceType(invoiceType)
                .issueDate(LocalDateTime.now())
                .subtotal(subtotal)
                .taxes(taxes)
                .total(total)
                .status(invoiceStatus)
                .build();

        return invoiceRepository.save(invoice);
    }

    private String generateInvoiceNumber(Sale sale) {
        // Formato: FACT-YYYYMMDD-ORDERID-SALEID
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String datePart = now.format(formatter);

        return String.format("FACT-%s-%d-%d",
                datePart,
                sale.getOrder().getId(),
                sale.getId());
    }
}