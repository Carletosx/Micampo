package com.agromarket.payments.web.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SolicitudReembolso(
    @NotNull UUID pagoId
) {}
