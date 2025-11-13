package com.agromarket.payments.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SolicitudStripeIntent(
    @NotNull BigDecimal monto,
    @NotBlank String moneda
) {}
