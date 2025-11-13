package com.agromarket.payments.web.dto;

import jakarta.validation.constraints.NotBlank;

public record SolicitudMetodoGuardado(
    @NotBlank String marca,
    @NotBlank String ultimos4,
    @NotBlank String tokenizado
) {}
